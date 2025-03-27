"use client";

import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useCart } from "@/components/CartContext";


export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [menuCategories, setMenuCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{
    item_id: number;
    item_name: string;
    sell_price: number;
    item_type: string;
    ingredients?: string[];
  } | null>(null);
  // Default customization: regular ice, sweetness: normal, teaType: greenTea, toppings: none, and no ingredients removed.
  const [customization, setCustomization] = useState<{
    ice: string;
    sweetness: string;
    teaType: string;
    removedIngredients: string[];
    toppings: string[];
  }>({
    ice: "Regular",
    sweetness: "Normal",
    teaType: "Green tea",
    removedIngredients: [],
    toppings: []
  });
  interface CartItem {
    item_id?: number;
    item_name?: string;
    sell_price?: number;
    item_type?: string;
    ingredients?: string[];
    customization: {
      ice: string;
      sweetness: string;
      teaType: string;
      removedIngredients: string[];
      toppings: string[];
    };
    quantity: number;
  }
  // Update the cart state to use this type
  const { cart, addToCart, removeFromCart, clearCart } = useCart();


  // The addCustomizedItem function can now be typed correctly
  const addCustomizedItem = () => {
    if (selectedItem) {
      const customizedItem: CartItem = { 
        ...selectedItem, 
        customization, 
        quantity: 1
      };
      addToCart(customizedItem);
      setSelectedItem(null);
    }
  };

  

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const res = await fetch('/api/menu');
        if (!res.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await res.json();
        console.log('Menu Items:', data);
        setMenuItems(data);

        // Extract unique categories from item_type property
        const categories = [...new Set(data.map((item: { item_type: string }) => item.item_type))] as string[];
        setMenuCategories(categories);
        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  // Filter menu items by the selected category
  const filteredMenuItems = selectedCategory 
    ? menuItems.filter(item => item.item_type === selectedCategory)
    : [];

  // Open the customization modal for the clicked item
  // Open the customization modal for the clicked item
  const openCustomization = (item: {
    item_id: number;
    item_name: string;
    sell_price: number;
    item_type: string;
    ingredients?: string[];
  }) => {
    setSelectedItem(item);
    setCustomization({
      ice: "Medium", 
      sweetness: "Normal",  // Add default sweetness
      teaType: "Green tea", // Add default teaType
      removedIngredients: [], // This stays as it was
      toppings: [] // Ensure toppings is initialized as an empty array
    });
  };


  // Calculate the total cost using the sell_price of each item
const total = cart.reduce((sum, item) => sum + (item.sell_price || 0), 0);

  // Handle order checkout: show alert and clear cart
  const handleCheckout = () => {
    alert('Order placed!');
    clearCart();
  };

  if (isLoading) {
    return (
    // centered loader while data is being fetched
      <div className="flex items-center justify-center h-screen">
        <span className="text-2xl font-bold mr-2">Loading Menu</span>
        <Loader />
      </div>
      
    );
  }

  return (
    <div className="flex mx-4 mt-10">
      {/* Categories Column */}
      <div className="w-64 pr-4 border-r">
        <div className="flex flex-col space-y-2">
          {menuCategories.map((category) => (
            <button 
              key={category} 
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-center p-2 rounded ${
                selectedCategory === category 
                  ? 'bg-accent text-white' 
                  : 'bg-primary text-black hover:bg-primary/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items and Cart Column */}
      <div className="flex-1 pl-4">
        <h2 className="text-2xl font-bold mb-4">{selectedCategory} Menu</h2>
        <div className="grid grid-cols-3 gap-4">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <div 
                key={item.item_id} 
                className="bg-background p-4 rounded-lg shadow-md cursor-pointer"
                onClick={() => openCustomization(item)}
              >
                <h3 className="font-bold text-accent text-lg">{item.item_name}</h3>
                <p className="text-text">${item.sell_price.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p>No items in this category.</p>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {selectedItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#E5CDC8] bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Customize {selectedItem.item_name}</h2>
            
            {/* Ice Level Option */}
            <div className="mb-4">
              <label className="block mb-2">Ice Level:</label>
              <select 
                value={customization.ice} 
                onChange={(e) => setCustomization({...customization, ice: e.target.value})} 
                className="border p-2 rounded w-full"
              >
                <option value="Regular">Regular</option>
                <option value="Less ice">Less ice</option>
                <option value="No ice">No ice</option>
              </select>
            </div>

            {/* Sweetness Level Option */}
            <div className="mb-4">
              <label className="block mb-2">Sweetness Level:</label>
              <select 
                value={customization.sweetness} 
                onChange={(e) => setCustomization({...customization, sweetness: e.target.value})} 
                className="border p-2 rounded w-full"
              >
                <option value="100%">Normal – 100% sugar</option>
                <option value="80%">Less sweet – 80% sugar</option>
                <option value="50%">Half sweet – 50% sugar</option>
                <option value="30%">Light – 30% sugar</option>
                <option value="0%">No sugar – 0% sugar</option>
              </select>
            </div>
            
            {/* Type of Tea Option */}
            <div className="mb-4">
              <label className="block mb-2">Type of Tea:</label>
              <select 
                value={customization.teaType} 
                onChange={(e) => setCustomization({...customization, teaType: e.target.value})} 
                className="border p-2 rounded w-full"
              >
                <option value="Green tea">Green tea</option>
                <option value="Black tea">Black tea</option>
                <option value="Oolong tea">Oolong tea</option>
              </select>
            </div>

            {/* Remove Ingredients Option */}
            <div className="mb-4">
              <p className="mb-2">Remove Ingredients:</p>
              {selectedItem.ingredients && selectedItem.ingredients.length > 0 ? (
                selectedItem.ingredients.map((ingredient) => (
                  <div key={ingredient}>
                    <label>
                      <input
                        type="checkbox"
                        checked={customization.removedIngredients.includes(ingredient)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomization({
                              ...customization,
                              removedIngredients: [...customization.removedIngredients, ingredient]
                            });
                          } else {
                            setCustomization({
                              ...customization,
                              removedIngredients: customization.removedIngredients.filter((ing) => ing !== ingredient)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      {ingredient}
                    </label>
                  </div>
                ))
              ) : (
                <p>No ingredients available for customization.</p>
              )}
            </div>
            
            {/* Toppings Option */}
            <div className="mb-4">
              <p className="mb-2">Toppings:</p>
              {[
                "aloe vera", "aiyu jelly", "lychee jelly", "herb jelly", "mini pearl",
                "red beans", "creama", "pudding", "ice cream", "crystal boba", "none"
              ].map((topping) => (
                <div key={topping}>
                  <label>
                    <input
                      type="checkbox"
                      checked={customization.toppings.includes(topping)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCustomization({
                            ...customization,
                            toppings: [...customization.toppings, topping]
                          });
                        } else {
                          setCustomization({
                            ...customization,
                            toppings: customization.toppings.filter((top) => top !== topping)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    {topping}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setSelectedItem(null)} 
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button 
                onClick={addCustomizedItem} 
                className="px-4 py-2 bg-accent text-white rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
