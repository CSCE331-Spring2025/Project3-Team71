"use client";

import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useCart } from "@/components/CartContext";
import CustomizationModal from "@/components/CustomizationModal";


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
  const handleCheckout = async () => {
    try {
      if (cart.length === 0) {
        alert('Your cart is empty');
        return;
      }
  
      // Define which ingredients are used for each menu item and topping
      const ingredientMappings = {
        // Base drinks (ingredient_id: quantity used)
        "Classic Milk Tea": [
          { ingredient_id: 1, quantityUsed: 5 },  // Black Tea Leaves
          { ingredient_id: 3, quantityUsed: 10 }, // Milk Powder
          { ingredient_id: 12, quantityUsed: 1 }, // Cups
          { ingredient_id: 13, quantityUsed: 1 }, // Straws
          { ingredient_id: 16, quantityUsed: 10 } // Ice
        ],
        "Green Milk Tea": [
          { ingredient_id: 2, quantityUsed: 5 },  // Green Tea Leaves
          { ingredient_id: 3, quantityUsed: 10 }, // Milk Powder
          { ingredient_id: 12, quantityUsed: 1 }, // Cups
          { ingredient_id: 13, quantityUsed: 1 }, // Straws
          { ingredient_id: 16, quantityUsed: 10 } // Ice
        ],
        // Add more mappings as needed for other menu items
        
        // Toppings
        "Boba Pearls": [{ ingredient_id: 5, quantityUsed: 30 }],
        "Tapioca Pearls": [{ ingredient_id: 6, quantityUsed: 30 }],
        "Lychee Jelly": [{ ingredient_id: 9, quantityUsed: 20 }],
        "Coconut Jelly": [{ ingredient_id: 18, quantityUsed: 20 }],
        "Popping Boba": [{ ingredient_id: 20, quantityUsed: 20 }]
      };
  
      // Calculate ingredients used from the cart
      const inventoryUpdates = [];
      
      for (const item of cart) {
        // Multiply quantities by item quantity
        const quantity = item.quantity || 1;
        
        // Add base drink ingredients
        const baseIngredients = ingredientMappings[item.item_name] || [];
        for (const ingredient of baseIngredients) {
          inventoryUpdates.push({
            ingredient_id: ingredient.ingredient_id,
            quantityUsed: ingredient.quantityUsed * quantity
          });
        }
        
        // Add ingredients for each topping
        if (item.customization && item.customization.toppings) {
          for (const topping of item.customization.toppings) {
            const toppingIngredients = ingredientMappings[topping] || [];
            for (const ingredient of toppingIngredients) {
              inventoryUpdates.push({
                ingredient_id: ingredient.ingredient_id,
                quantityUsed: ingredient.quantityUsed * quantity
              });
            }
          }
        }
      }
      
      // Combine duplicate ingredient updates
      const consolidatedUpdates = {};
      for (const update of inventoryUpdates) {
        if (!consolidatedUpdates[update.ingredient_id]) {
          consolidatedUpdates[update.ingredient_id] = update.quantityUsed;
        } else {
          consolidatedUpdates[update.ingredient_id] += update.quantityUsed;
        }
      }
      
      // Convert to the format expected by the API
      const items = Object.entries(consolidatedUpdates).map(([ingredient_id, quantityUsed]) => ({
        ingredient_id: parseInt(ingredient_id),
        quantityUsed
      }));
      
      console.log("Sending inventory update:", items);
      
      // Call the updateInventory API
      const response = await fetch('/api/updateInventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
      
      const result = await response.json();
      console.log("Inventory update response:", result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update inventory');
      }
      
      // Check for low inventory warnings
      if (result.lowInventoryItems && result.lowInventoryItems.length > 0) {
        alert(`Order placed successfully, but some ingredients are running low: ${
          result.lowInventoryItems.map(item => `${item.name} (${item.remaining}/${item.minimum})`).join(', ')
        }`);
      } else {
        alert('Order placed successfully!');
      }
      
      // Clear cart after successful checkout
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
