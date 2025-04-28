"use client";

import { useEffect, useState } from "react";

export default function MenuBoard() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Error fetching menu");
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    }
    fetchMenu();
  }, []);

  const categories = [...new Set(menuItems.map((item) => item.item_type))];

  useEffect(() => {
    if (categories.length > 0) {
      const interval = setInterval(() => {
        setCurrentCategoryIndex(
          (prevIndex) => (prevIndex + 1) % categories.length
        );
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
  const filteredItems = menuItems.filter(
    (item) => item.item_type === currentCategory
  );

  // Function to pick 3 random unique items for the left container
  const leftImageFinder = () => {
    let selectedItems: typeof filteredItems[number][] = [];
    while (selectedItems.length < 3) {
      const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
      // Ensure unique item selection
      if (!selectedItems.some(item => item.item_id === randomItem.item_id)) {
        selectedItems.push(randomItem);
      }
    }
    return selectedItems;
  };

  // Function to pick 3 random unique items for the right container
  const rightImageFinder = () => {
    let selectedItems: typeof filteredItems[number][] = [];
    while (selectedItems.length < 3) {
      const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
      // Ensure unique item selection
      if (!selectedItems.some(item => item.item_id === randomItem.item_id)) {
        selectedItems.push(randomItem);
      }
    }
    return selectedItems;
  };

  // Get random items for both left and right containers
  const leftRandomItems = leftImageFinder();
  const rightRandomItems = rightImageFinder();

  return (
    <div className="relative mt-24 z-10 flex justify-center">
      <div className="flex w-full max-w-screen-xl justify-center items-start">
        {/* Left Transparent Container */}
        <div className="flex-1 flex justify-end">
          <div className="flex flex-col items-end pr-2 pt-12">
            {leftRandomItems.map((item) => (
              <div
                key={item.item_id}
                className="w-40 h-40 mb-8 shadow rounded-full overflow-hidden mr-1"
              >
                <img
                  src={`/images/${item.item_id}.jpg`}
                  alt={item.item_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Menu Board */}
        <div className="relative px-6 py-8 bg-white w-fit shadow rounded-lg z-10">
          <h1 className="text-4xl font-bold mb-8 text-center uppercase tracking-wide">
            {currentCategory}
          </h1>
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-x-32 font-semibold text-lg border-b-2 border-black pb-2 mb-4">
            <span></span>
            <span className="whitespace-nowrap">Regular Price</span>
            <span className="whitespace-nowrap">Happy Hour Price</span>
          </div>
          <div className="grid gap-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.item_id}
                className="grid grid-cols-[2fr_1fr_1fr] gap-x-32 text-xl font-mono"
              >
                <span>{item.item_name}</span>
                <span>${Number(item.sell_price).toFixed(2)}</span>
                <span>
                  {item.happy_hour_price !== null
                    ? `$${Number(item.happy_hour_price).toFixed(2)}`
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image Container */}
        <div className="flex-1 flex justify-start">
          <div className="flex flex-col items-start pl-2 pt-12">
            {rightRandomItems.map((item) => (
              <div
                key={item.item_id + "-right"}
                className="w-40 h-40 mb-8 shadow rounded-full overflow-hidden ml-1"
              >
                <img
                  src={`/images/${item.item_id}.jpg`}
                  alt={item.item_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}