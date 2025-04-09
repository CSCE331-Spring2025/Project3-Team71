"use client";
import Image from "next/image";
import { useState, ChangeEvent, useEffect } from "react";

interface MenuItem {
  item_id: number;
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  image?: File | null;
}

export default function ManageMenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  type Ingredient = {
    ingredient_id: number;
    name: string;
  };
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [ingredients, setIngredients] = useState<number[]>([]);
  


  // Derive the list of categories
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  // State for selected category and modal controls
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalName, setItemName] = useState("");
  const [modalPrice, setItemPrice] = useState<number>(0);
  const [modalImage, setItemImage] = useState<File | null>(null);

  useEffect(() => {
    console.log('Available Ingredients:', availableIngredients);
  }, [availableIngredients]);

  useEffect(() => {
    fetchMenuItems();
  }, []); 

  
  async function fetchMenuItems() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/menu');
      if (!res.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await res.json();
      const formatted: MenuItem[] = data.map((item: any) => ({
        item_id: item.item_id,
        name: item.item_name,
        category: item.item_type,
        price: item.sell_price,
        ingredients: [],
        image: null,
      }));      

      setMenuItems(formatted);

      const categories = [...new Set(formatted.map((item) => item.category))];

      
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

  async function GetIngredients(itemId: number): Promise<Ingredient[]> {
    try {
      const res = await fetch(`/api/ingredients?item_id=${itemId}`);
      if (!res.ok) throw new Error('Failed to fetch ingredients');
      const data = await res.json();
      return data.ingredients || []; // Assume ingredients = [{ ingredient_id, name }]
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  

  // Handle ingredient checkbox toggle
  const handleIngredientChange = (item_id: number) => {
    setIngredients((prev) =>
      prev.includes(item_id)
        ? prev.filter((ingId) => ingId !== item_id)
        : [...prev, item_id]
    );
  };
  

  // Handle file upload changes
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(e.target.files[0]);
    }
  };

  // Open modal for adding or editing an item
  const openModal = async (item?: MenuItem) => {
    if (item) {
      setSelectedItem(item);
      setItemName(item.name);
      setItemPrice(item.price);
      setItemImage(item.image || null);
  
      const selected = await GetIngredients(item.item_id);
      const all = await GetIngredients(0);
  
      setAvailableIngredients(all);
      setIngredients(selected.map(ing => ing.ingredient_id));
      setIsModalOpen(true);
    } else {
      const all = await GetIngredients(0);
      setAvailableIngredients(all);
      setIngredients([]);
      setSelectedItem(null);
      setItemName("");
      setItemPrice(0);
      setItemImage(null);
      setIsModalOpen(true);
    }
  };
  
  
  

  // Save the item (update existing or add new)
  const saveItem = async () => {
    if (selectedItem) {
      // call update API
      const res = await fetch(`/api/menu/${selectedItem.item_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_name: modalName,
          sell_price: modalPrice,
          ingredients,
        }),
      });
    }
    else{
      // call add API
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_name: modalName,
          item_type: selectedCategory,
          sell_price: modalPrice,
          ingredients,
        }),
      });
      if (res.ok) {
        // refetch menu items
        fetchMenuItems();
      } else {
        console.error("Failed to add item:", await res.json());
      }
    }
    setIsModalOpen(false);
  };

  // Delete an existing item
  const deleteItem = () => {
    if (selectedItem) {
      fetch(`/api/menu/${selectedItem.item_id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setMenuItems((prev) =>
              prev.filter((item) => item.item_id !== selectedItem.item_id)
            );
            setIsModalOpen(false);
          } else {
            console.error("Failed to delete item:", res.statusText);
          }
        })
        .catch((err) => console.error("Error deleting item:", err));
    }
  };

  // Filter items by the selected category
  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : [];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Menu Items</h1>
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg">Loading...</p>
          <div className="flex items-center justify-center h-screen">
            <Image
              src="/mascotDancing.gif"
              alt="mascot"
              width={75}
              height={100}
            />
          </div>
        </div>
      )}
      
      {!isLoading && menuItems.length === 0 && (
        <p className="text-center">No menu items available.</p>
      )}
      {/* Category Selection */}
      <div className="flex justify-center space-x-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat
                ? "bg-accent text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items List & Add New Item Button */}
      {selectedCategory && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {selectedCategory} Items
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.item_id}
                className="bg-white border rounded p-4 flex flex-col items-center cursor-pointer hover:shadow-lg"
                onClick={() => openModal(item)}
              >
                <h3 className="font-bold">{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => openModal()}
              className="px-6 py-3 bg-accent text-white rounded hover:bg-white hover:text-black transition"
            >
              Add New Item
            </button>
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing an Item */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedItem ? "Edit Item" : "Add New Item"}
            </h2>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                value={modalName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                value={modalPrice}
                min="0"
                onChange={(e) => setItemPrice(parseFloat(e.target.value) || 0)}
                className="w-full border p-2 rounded"
              />
            </div>
            {/* Ingredients Checkboxes */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">
                Ingredients
              </label>
              <div className="flex flex-wrap gap-2">
              {availableIngredients.map((ingredient) => (
                <div key={ingredient.ingredient_id} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={ingredients.includes(ingredient.ingredient_id)}
                    onChange={() => handleIngredientChange(ingredient.ingredient_id)}
                  />
                  <span>{ingredient.name}</span>
                </div>
              ))}

              </div>
            </div>
            {/* Image Upload */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold">
                Upload Image
              </label>
              <input type="file" onChange={handleImageChange} />
              {modalImage && (
                <p className="mt-1 text-sm">
                  Selected file: {modalImage.name}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              {selectedItem && (
                <button
                  onClick={deleteItem}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
