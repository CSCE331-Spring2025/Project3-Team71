"use client";

import { useEffect, useState } from "react";

export default function MenuBoard() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) {
          throw new Error("Error fetching menu");
        }
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

  return (
    <div className="mt-24 px-6 py-8 bg-white w-fit mx-auto shadow rounded-lg">
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
  );
}