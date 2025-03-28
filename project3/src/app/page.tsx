"use client";

import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useCart } from "@/components/CartContext";
import CustomizationModal from "@/components/CustomizationModal";
import Image from 'next/image';

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
        <span className="text-2xl font-bold">Loading Menu...</span>
        <div className="flex items-center justify-center h-screen">
          <Image
            src="/mascotDancing.gif"
            alt="mascot"
            width={75}
            height={100}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex mx-4 mt-10 mb-10 space-x-4 pt-16">
      {/* Categories Column */}
      <div className="w-64 pr-4 border-r">
        <div className="flex flex-col space-y-2">
          {menuCategories.map((category) => (
            <button 
              key={category} 
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-center p-2 rounded ${
                selectedCategory === category 
                  ? 'bg-accent font-bold text-white' 
                  : 'bg-primary font-bold text-accent hover:bg-primary border border-primary border-2'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items and Cart Column */}
      <div className="flex-1 pl-4 mb-10">
        <h2 className="text-2xl text-accent font-bold ml-1 mb-4">{selectedCategory} Menu</h2>
        <div className="grid grid-cols-3 gap-4">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <div 
                key={item.item_id} 
                className="bg-white border border-3 border-primary p-4 rounded-lg shadow-md cursor-pointer"
                onClick={() => openCustomization(item)}
              >
                {/* Display the image corresponding to the item_id */}
                <div className="relative w-full aspect-square mb-2">
                <img
                  src={`/images/${item.item_id}.jpg`}
                  alt={item.item_name}
                  className="absolute border border-2 border-primary inset-0 w-full h-full object-cover rounded"
                />
                </div>

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
        <CustomizationModal
          selectedItem={selectedItem}
          customization={customization}
          setCustomization={setCustomization}
          addCustomizedItem={addCustomizedItem}
          closeModal={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
