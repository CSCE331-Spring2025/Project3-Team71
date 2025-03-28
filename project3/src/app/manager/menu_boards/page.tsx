"use client";

import { useEffect, useState } from 'react';

export default function MenuBoard() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        if (!res.ok) {
          throw new Error('Error fetching menu');
        }
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      }
    }
    fetchMenu();
  }, []);

  // Get a list of unique categories
  const categories = [...new Set(menuItems.map(item => item.item_type))];

  // Rotate the categories every 10 seconds
  useEffect(() => {
    if (categories.length > 0) {
      const interval = setInterval(() => {
        setCurrentCategoryIndex(prevIndex => (prevIndex + 1) % categories.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [categories]);

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading Menu Board...</p>
      </div>
    );
  }

  const currentCategory = categories[currentCategoryIndex];
  const filteredItems = menuItems.filter(item => item.item_type === currentCategory);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Display the current category name */}
      <h1 className="text-3xl font-bold mb-6 text-center">{currentCategory}</h1>
      
      {/* Flex container to mimic a grid with wrapping and centering */}
      <div className="flex flex-wrap justify-center gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.item_id} 
            className="bg-white rounded shadow p-4 flex flex-col items-center w-64"
          >
            {/* Image container with fixed aspect ratio */}
            <div className="w-full aspect-square relative mb-2">
              <img
                src={`/images/${item.item_id}.jpg`}
                alt={item.item_name}
                className="absolute inset-0 w-full h-full object-cover rounded"
              />
            </div>
            <h2 className="text-xl font-bold text-center">{item.item_name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
