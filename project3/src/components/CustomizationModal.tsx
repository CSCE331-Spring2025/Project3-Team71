import React, { useState } from 'react';

interface CustomizationProps {
  selectedItem: {
    item_id: number;
    item_name: string;
    sell_price: number;
    item_type: string;
    kcal?: number;
    saturated_fat_g?: number;
    sodium_mg?: number;
    carbs_g?: number;
    sugar_g?: number;
    vegetarian_foods?: string;
    allergen?: string;
    caffeine_mg?: number;
  } | null;
  customization: {
    ice: string;
    sweetness: string;
    teaType: string;
    removedIngredients: string[];
    toppings: string[];
  };
  setCustomization: React.Dispatch<React.SetStateAction<{
    ice: string;
    sweetness: string;
    teaType: string;
    removedIngredients: string[];
    toppings: string[];
  }>>;
  addCustomizedItem: () => void;
  closeModal: () => void;
  ingredients: { ingredient_id: number; name: string }[];
  highContrast?: boolean;
}

const CustomizationModal: React.FC<CustomizationProps> = ({
  selectedItem,
  customization,
  setCustomization,
  addCustomizedItem,
  closeModal,
  ingredients,
  highContrast
}) => {
  const [view, setView] = useState<"customize" | "nutrition">("customize");

  const renderCustomizationView = () => (
    <div className={`p-4 ${highContrast ? 'bg-black text-yellow-300' : ''}`}>
      <h2 className="text-xl font-bold text-accent mb-4 text-center">
        Customize {selectedItem?.item_name}
      </h2>

      {/* Ice Level */}
      <div className="mb-4">
        <label className="block mb-2 text-accent font-semibold">Ice Level:</label>
        <select
          value={customization.ice}
          onChange={(e) => setCustomization({ ...customization, ice: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="Regular">Regular</option>
          <option value="Less ice">Less ice</option>
          <option value="No ice">No ice</option>
        </select>
      </div>

      {/* Sweetness Level */}
      <div className="mb-4">
        <label className="block mb-2 text-accent font-semibold">Sweetness Level:</label>
        <select
          value={customization.sweetness}
          onChange={(e) => setCustomization({ ...customization, sweetness: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="100%">Normal – 100% sugar</option>
          <option value="80%">Less sweet – 80% sugar</option>
          <option value="50%">Half sweet – 50% sugar</option>
          <option value="30%">Light – 30% sugar</option>
          <option value="0%">No sugar – 0% sugar</option>
        </select>
      </div>

      {/* Type of Tea */}
      <div className="mb-4">
        <label className="block mb-2 text-accent font-semibold">Type of Tea:</label>
        <select
          value={customization.teaType}
          onChange={(e) => setCustomization({ ...customization, teaType: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="Green tea">Green tea</option>
          <option value="Black tea">Black tea</option>
          <option value="Oolong tea">Oolong tea</option>
        </select>
      </div>

      {/* Remove Ingredients */}
      <div className="mb-4">
        <p className="mb-2 text-accent font-semibold">Remove Ingredients:</p>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient) => (
            <div key={ingredient.ingredient_id}>
              <label>
                <input
                  type="checkbox"
                  checked={customization.removedIngredients.includes(ingredient.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCustomization({
                        ...customization,
                        removedIngredients: [...customization.removedIngredients, ingredient.name],
                      });
                    } else {
                      setCustomization({
                        ...customization,
                        removedIngredients: customization.removedIngredients.filter(
                          (ing) => ing !== ingredient.name
                        ),
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

      {/* Toppings */}
      <div className="mb-4">
        <p className="mb-2 text-accent font-semibold">Toppings:</p>
        {[
          "aloe vera", "aiyu jelly", "lychee jelly", "herb jelly", "mini pearl",
          "red beans", "creama", "pudding", "ice cream", "crystal boba"
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
                      toppings: [...customization.toppings, topping],
                    });
                  } else {
                    setCustomization({
                      ...customization,
                      toppings: customization.toppings.filter((top) => top !== topping),
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
        <button onClick={closeModal} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button onClick={addCustomizedItem} className="px-4 py-2 bg-accent text-white rounded">
          Add to Cart
        </button>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setView("nutrition")}
          className="px-4 py-2 bg-accent text-white border rounded"
        >
          Nutrition and Allergy Info
        </button>
      </div>
    </div>
  );

  const renderNutritionView = () => (
    <div className={`p-4 ${highContrast ? 'bg-black text-yellow-300' : ''}`}>
      <h2 className="text-xl font-bold text-accent mb-4 text-center">
        Nutrition & Allergy Info for {selectedItem?.item_name}
      </h2>
      <ul className="space-y-2">
        <li><strong>Calories:</strong> {selectedItem?.kcal ?? "N/A"} Kcal</li>
        <li><strong>Saturated Fat:</strong> {selectedItem?.saturated_fat_g ?? "N/A"} g</li>
        <li><strong>Sodium:</strong> {selectedItem?.sodium_mg ?? "N/A"} mg</li>
        <li><strong>Carbohydrates:</strong> {selectedItem?.carbs_g ?? "N/A"} g</li>
        <li><strong>Sugar:</strong> {selectedItem?.sugar_g ?? "N/A"} g</li>
        <li><strong>Vegetarian Options:</strong> {selectedItem?.vegetarian_foods ?? "N/A"}</li>
        <li><strong>Allergens:</strong> {selectedItem?.allergen || "None"}</li>
        <li><strong>Caffeine:</strong> {selectedItem?.caffeine_mg ?? "N/A"} mg</li>
      </ul>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setView("customize")}
          className="px-4 py-2 bg-accent text-white border rounded"
        >
          Back to Customize
        </button>
      </div>
    </div>
  );

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-[#E5CDC8] bg-opacity-50 flex items-center justify-center z-50 
      ${highContrast ? 'bg-black text-yellow-300' : ''}`}>
      <div className={`relative bg-white p-4 rounded-lg w-126 max-h-[90vh] overflow-y-auto 
        ${highContrast ? 'bg-black text-yellow-300' : ''}`}>
        

        {view === "customize" ? renderCustomizationView() : renderNutritionView()}
      </div>
    </div>
  );
};

export default CustomizationModal;
