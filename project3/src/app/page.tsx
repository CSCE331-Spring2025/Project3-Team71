"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Accessibility, Loader } from 'lucide-react';
import { useCart } from "@/components/CartContext";
import CustomizationModal from "@/components/CustomizationModal";
import GoogleTranslate from "@/components/GoogleTranslate/GoogleTranslate";
import WeatherWidget from "@/components/WeatherWidget";
import { useHappyHourStatus } from "@/hooks/useHappyHourStatus";

export default function MenuPage() {
  const isHappyHour = useHappyHourStatus();

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [menuCategories, setMenuCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState<{ ingredient_id: number; name: string }[]>([]);
  const [isLoadingNutrition, setIsLoadingNutrition] = useState(true);
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  const [selectedItem, setSelectedItem] = useState<{
    item_id: number;
    item_name: string;
    sell_price: number;
    happy_hour_price: number;
    item_type: string;
    ingredients: { ingredient_id: number; name: string }[];
  } | null>(null);

  const [customization, setCustomization] = useState({
    ice: "Regular",
    sweetness: "Normal",
    teaType: "Green tea",
    removedIngredients: [],
    toppings: []
  });

  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const addCustomizedItem = () => {
    if (selectedItem) {
      const customizedItem = { ...selectedItem, customization, quantity: 1 };
      addToCart(customizedItem);
      setSelectedItem(null);
    }
  };

  async function GetIngredients(itemId: number) {
    const res = await fetch(`/api/ingredients?item_id=${itemId}`);
    const data = await res.json();
    return data.ingredients || [];
  }

  async function GetNutrition(itemId: number) {
    const res = await fetch(`/api/nutrition/${itemId}`);
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        setMenuItems(data);

        const categories = [...new Set(data.map((item: any) => item.item_type))];
        setMenuCategories(categories);
        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  useEffect(() => {
    async function fetchIngredients() {
      if (selectedItem?.item_id) {
        setIsLoadingIngredients(true);
        const fetchedIngredients = await GetIngredients(selectedItem.item_id);
        setIngredients(fetchedIngredients);
        setIsLoadingIngredients(false);
      }
    }
    fetchIngredients();
  }, [selectedItem]);

  useEffect(() => {
    async function fetchNutrition() {
      if (selectedItem?.item_id) {
        setIsLoadingNutrition(true);
        const fetchedNutrition = await GetNutrition(selectedItem.item_id);
        setNutritionData(fetchedNutrition);
        setIsLoadingNutrition(false);
      }
    }
    fetchNutrition();
  }, [selectedItem]);

  const filteredMenuItems = selectedCategory
    ? menuItems.filter(item => item.item_type === selectedCategory)
    : [];

  const openCustomization = async (item: any) => {
    const fetchedIngredients = await GetIngredients(item.item_id);
    const fetchedNutrition = await GetNutrition(item.item_id);

    setSelectedItem({
      ...item,
      ingredients: fetchedIngredients
    });

    setCustomization({
      ice: "Medium",
      sweetness: "Normal",
      teaType: "Green tea",
      removedIngredients: [],
      toppings: []
    });

    setNutritionData(fetchedNutrition);
    setShowModal(true);
  };

  const total = cart.reduce((sum, item) => sum + (item.sell_price || 0), 0);

  const handleCheckout = () => {
    alert('Order placed!');
    clearCart();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-2xl font-bold">Loading Menu...</span>
        <Image src="/mascotDancing.gif" alt="mascot" width={75} height={100} />
      </div>
    );
  }

  return (
    <div className={`flex mx-4 mt-10 mb-10 space-x-4 pt-16 ${highContrast ? 'bg-black text-yellow-300' : ''}`} style={{ fontSize: `${fontScale}rem` }}>
      <WeatherWidget />

      {/* Accessibility Button & Modal */}
      <div className="fixed bottom-2 right-2 flex flex-col items-end z-50">
        <div className={`relative mb-1 w-40 p-2 ${accessibilityModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
          <div className="absolute bottom-0 right-6 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
          <div className={`p-4 rounded shadow-lg ${highContrast ? 'bg-black text-yellow-300' : 'bg-white'}`}>
            <h3 className="font-bold text-lg mb-2">Accessibility Options</h3>
            <p className="text-sm mb-2">Font Size:</p>
            <div className="flex items-center space-x-2 mb-5 justify-center">
              <button onClick={() => setFontScale(prev => Math.max(0.75, prev - 0.1))} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">A-</button>
              <button onClick={() => setFontScale(1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">A</button>
              <button onClick={() => setFontScale(prev => Math.min(2, prev + 0.1))} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">A+</button>
            </div>
            <p className="text-sm mb-1">High Contrast:</p>
            <button onClick={() => setHighContrast(prev => !prev)} className={`px-3 py-1 rounded font-semibold ${highContrast ? 'bg-yellow-300 text-black' : 'bg-gray-200 text-black'}`}>
              {highContrast ? 'Disable' : 'Enable'}
            </button>
            <p className="text-sm mt-3 mb-2">Translate:</p>
            <GoogleTranslate />
          </div>
        </div>
        <button className="bg-accent text-white font-bold p-2 rounded-full" onClick={() => setAccessibilityModalOpen(!accessibilityModalOpen)}>
          <Accessibility size={32} />
        </button>
      </div>

      {/* Category Buttons */}
      <div className="w-64 pr-4 border-r">
        <div className="flex flex-col space-y-2">
          {menuCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full p-2 rounded ${selectedCategory === category ? 'bg-accent font-bold text-white' : 'bg-primary text-accent border-2 border-primary'} ${highContrast ? 'bg-black text-yellow-300' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 pl-4 mb-10">
        <div className="grid grid-cols-3 gap-4">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <div
                key={item.item_id}
                className={`border border-primary p-4 rounded-lg shadow-md cursor-pointer ${highContrast ? 'bg-black text-yellow-300' : 'bg-white'}`}
                onClick={() => openCustomization(item)}
              >
                <div className="relative w-full aspect-square mb-2">
                  <img
                    src={`/images/${item.item_id}.jpg`}
                    alt={item.item_name}
                    className="absolute inset-0 w-full h-full object-cover rounded border border-primary"
                  />
                </div>
                <h3 className={`font-bold ${highContrast ? 'text-yellow-300' : 'text-accent'}`}>{item.item_name}</h3>
                <p className="text-text">
                  ${isHappyHour && item.happy_hour_price !== null
                    ? item.happy_hour_price.toFixed(2)
                    : item.sell_price.toFixed(2)}
                </p>
                {isHappyHour && item.happy_hour_price !== null && (
                  <p className="text-xs text-yellow-600 mt-1">Happy Hour Price!</p>
                )}
              </div>
            ))
          ) : (
            <p>No items in this category.</p>
          )}
        </div>
      </div>

      {showModal && selectedItem && (
        <CustomizationModal
          selectedItem={selectedItem}
          customization={customization}
          setCustomization={setCustomization}
          addCustomizedItem={addCustomizedItem}
          closeModal={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          ingredients={ingredients}
          nutritionData={nutritionData}
          highContrast={highContrast}
        />
      )}
    </div>
  );
}
