import React, { useEffect, useState } from 'react';

interface CustomizationProps {
  selectedItem: {
    item_id: number;
    item_name: string;
    sell_price: number;
    item_type: string;
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
}

async function GetIngredients(itemId: number): Promise<string[]> {
  try {
    const res = await fetch(`/api/ingredients?item_id=${itemId}`);
    if (!res.ok) throw new Error('Failed to fetch ingredients');
    const data = await res.json();
    return data.ingredients || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const CustomizationModal: React.FC<CustomizationProps> = ({
  selectedItem,
  customization,
  setCustomization,
  addCustomizedItem,
  closeModal,
}) => {
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    async function fetchIngredients() {
      if (selectedItem?.item_id) {
        const fetchedIngredients = await GetIngredients(selectedItem.item_id);
        setIngredients(fetchedIngredients);
      }
    }
    fetchIngredients();
  }, [selectedItem]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#E5CDC8] bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Customize {selectedItem?.item_name}</h2>

        {/* Ice Level Option */}
        <div className="mb-4">
          <label className="block mb-2">Ice Level:</label>
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

        {/* Sweetness Level Option */}
        <div className="mb-4">
          <label className="block mb-2">Sweetness Level:</label>
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

        {/* Type of Tea Option */}
        <div className="mb-4">
          <label className="block mb-2">Type of Tea:</label>
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

        {/* Remove Ingredients Option (Dynamically Fetched) */}
        <div className="mb-4">
          <p className="mb-2">Remove Ingredients:</p>
          {ingredients.length > 0 ? (
            ingredients.map((ingredient) => (
              <div key={ingredient}>
                <label>
                  <input
                    type="checkbox"
                    checked={customization.removedIngredients.includes(ingredient)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCustomization({
                          ...customization,
                          removedIngredients: [...customization.removedIngredients, ingredient],
                        });
                      } else {
                        setCustomization({
                          ...customization,
                          removedIngredients: customization.removedIngredients.filter(
                            (ing) => ing !== ingredient
                          ),
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
            "red beans", "creama", "pudding", "ice cream", "crystal boba",
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
      </div>
    </div>
  );
};

export default CustomizationModal;
