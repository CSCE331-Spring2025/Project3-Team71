"use client";

import { useState, useEffect } from 'react';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  // Default customization: medium ice and no ingredients removed.
  const [customization, setCustomization] = useState({ ice: "Medium", removedIngredients: [] });
  const [cart, setCart] = useState([]);

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
        const categories = [...new Set(data.map(item => item.item_type))];
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
  const openCustomization = (item) => {
    setSelectedItem(item);
    setCustomization({ ice: "Medium", removedIngredients: [] });
  };

// Add the customized item to the cart
const addCustomizedItem = () => {
  const customizedItem = {
    ...selectedItem,
    ingredients: selectedItem.ingredients ?? [], // ⬅️ ensure ingredients are preserved
    customization,
  };

  setCart((prevCart) => [...prevCart, customizedItem]);
  setSelectedItem(null);
};


  // Remove an item from the cart by its index
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Calculate the total cost using the sell_price of each item
  const total = cart.reduce((sum, item) => sum + item.sell_price, 0);

  // Handle order checkout: show alert and clear cart
const handleCheckout = async () => {
  // 1. Build ingredient usage map
  const ingredientUsage = {};

  cart.forEach(item => {
    if (!item.ingredients) return;

    item.ingredients.forEach(ingredientId => {
      if (item.customization?.removedIngredients?.includes(ingredientId)) return;

      if (!ingredientUsage[ingredientId]) {
        ingredientUsage[ingredientId] = 0;
      }
      ingredientUsage[ingredientId] += 1; // 1 unit per ingredient per item
    });
  });

  // 2. Convert to array for API
  const items = Object.entries(ingredientUsage).map(([ingredient_id, quantityUsed]) => ({
    ingredient_id: parseInt(ingredient_id),
    quantityUsed
  }));

  // 3. Send to API

console.log('🛒 Cart:', cart);
console.log('📦 Items payload:', items);

  try {
    const res = await fetch('/api/updateInventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Order placed and inventory updated!');
      setCart([]);
    } else {
      alert('Failed to update inventory: ' + data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Checkout failed due to a network error.');
  }
};


  if (isLoading) {
    return <div>Loading menu...</div>;
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

        {/* Cart Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item, index) => (
                <div key={index} className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <p className="font-bold">{item.item_name}</p>
                    <p>${item.sell_price.toFixed(2)}</p>
                    {item.customization && (
                      <p className="text-sm text-gray-600">
                        Ice: {item.customization.ice}
                        {item.customization.removedIngredients.length > 0 &&
                          `, Removed: ${item.customization.removedIngredients.join(', ')}`}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeFromCart(index)} className="text-red-500">
                    Remove
                  </button>
                </div>
              ))}
              <h3 className="text-xl font-bold mt-4">Total: ${total.toFixed(2)}</h3>
              <button 
                onClick={handleCheckout} 
                className="bg-accent text-white p-2 rounded mt-2"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {selectedItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Customize {selectedItem.item_name}</h2>
            {/* Ice Level Option */}
            <div className="mb-4">
              <label className="block mb-2">Ice Level:</label>
              <select 
                value={customization.ice} 
                onChange={(e) => setCustomization({...customization, ice: e.target.value})} 
                className="border p-2 rounded w-full"
              >
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>
            {/* Remove Ingredients Option */}
            <div className="mb-4">
              <p className="mb-2">Remove Ingredients:</p>
              {selectedItem.ingredients && selectedItem.ingredients.length > 0 ? (
                selectedItem.ingredients.map((ingredient) => (
                  <div key={ingredient.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={customization.removedIngredients.includes(ingredient)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomization({
                              ...customization,
                              removedIngredients: [...customization.removedIngredients, ingredient.id]
                            });
                          } else {
                            setCustomization({
                              ...customization,
                              removedIngredients: customization.removedIngredients.filter((id) => id !== ingredient.id)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      {ingredient.name}
                    </label>
                  </div>
                ))
              ) : (
                <p>No ingredients available for customization.</p>
              )}
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
