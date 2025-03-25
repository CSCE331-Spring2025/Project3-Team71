'use client'

import { useState, useEffect } from 'react'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        
        // Extract unique categories
        const categories = [...new Set(data.map(item => item.item_type))];
        setMenuCategories(categories);
        
        // Set default category to first category
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

  // Filter menu items by selected category
  const filteredMenuItems = selectedCategory 
    ? menuItems.filter(item => item.item_type === selectedCategory)
    : [];

  if (isLoading) {
    return <div>Loading menu...</div>
  }

  return (
    <div className="flex mx-4 mt-10">
      {/* Category Buttons - Vertical Layout */}
      <div className="w-64 pr-4 border-r">
        {/* <h3 className="text-lg font-bold mb-4 text-center">Categories</h3> */}
        <div className="flex flex-col space-y-2 ">
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

      {/* Menu Items - Grid Layout */}
      <div className="flex-1 pl-4">
        <h2 className="text-2xl font-bold mb-4">{selectedCategory} Menu</h2>
        <div className="grid grid-cols-3 gap-4">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <div 
                key={item.item_id} 
                className="bg-background p-4 rounded-lg shadow-md"
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
    </div>
  )
}