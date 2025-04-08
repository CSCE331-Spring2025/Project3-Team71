"use client";

import { useState, ChangeEvent } from "react";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  image?: File | null;
}

export default function ManageMenuItemsPage() {
  // Hardcoded sample data (extended with ingredients; image is null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: "Classic Milk Tea", category: "Milk Tea", price: 4.5, ingredients: ["Tea", "Milk"], image: null },
    { id: 5, name: "Honey Milk Tea", category: "Milk Tea", price: 5.0, ingredients: ["Tea", "Honey"], image: null },
    { id: 6, name: "Matcha Milk Tea", category: "Milk Tea", price: 5.25, ingredients: ["Tea", "Milk"], image: null },
    { id: 2, name: "Matcha Latte", category: "Fresh Milk", price: 5.25, ingredients: ["Milk", "Matcha"], image: null },
    { id: 7, name: "Vanilla Fresh Milk", category: "Fresh Milk", price: 5.0, ingredients: ["Milk", "Vanilla"], image: null },
    { id: 3, name: "Peach Mojito", category: "Mojitos", price: 4.5, ingredients: ["Peach", "Mint"], image: null },
    { id: 8, name: "Strawberry Mojito", category: "Mojitos", price: 4.75, ingredients: ["Strawberry", "Mint"], image: null },
    { id: 4, name: "Berry Fruit Tea", category: "Fruit Tea", price: 4.75, ingredients: ["Berries", "Tea"], image: null },
    { id: 9, name: "Mango Fruit Tea", category: "Fruit Tea", price: 4.5, ingredients: ["Mango", "Tea"], image: null },
  ]);

  // Define a list of available ingredients for checkboxes
  const availableIngredients = ["Tea", "Milk", "Honey", "Tapioca Pearls", "Sugar"];

  // Derive the list of categories
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  // State for selected category and modal controls
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalName, setModalName] = useState("");
  const [modalPrice, setModalPrice] = useState<number>(0);
  const [modalIngredients, setModalIngredients] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<File | null>(null);

  // Handle ingredient checkbox toggle
  const handleIngredientChange = (ingredient: string) => {
    setModalIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((ing) => ing !== ingredient)
        : [...prev, ingredient]
    );
  };

  // Handle file upload changes
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModalImage(e.target.files[0]);
    }
  };

  // Open modal for adding or editing an item
  const openModal = (item?: MenuItem) => {
    if (item) {
      setSelectedItem(item);
      setModalName(item.name);
      setModalPrice(item.price);
      setModalIngredients(item.ingredients || []);
      setModalImage(item.image || null);
    } else {
      // New item defaults
      setSelectedItem(null);
      setModalName("");
      setModalPrice(0);
      setModalIngredients([]);
      setModalImage(null);
    }
    setIsModalOpen(true);
  };

  // Save the item (update existing or add new)
  const saveItem = () => {
    if (selectedItem) {
      // Update existing item
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                name: modalName,
                price: modalPrice,
                ingredients: modalIngredients,
                image: modalImage,
              }
            : item
        )
      );
    } else {
      // Add new item, generate new ID
      const newId =
        menuItems.length > 0 ? Math.max(...menuItems.map((item) => item.id)) + 1 : 1;
      const newItem: MenuItem = {
        id: newId,
        name: modalName,
        category: selectedCategory || "Uncategorized",
        price: modalPrice,
        ingredients: modalIngredients,
        image: modalImage,
      };
      setMenuItems((prevItems) => [...prevItems, newItem]);
    }
    setIsModalOpen(false);
  };

  // Delete an existing item
  const deleteItem = () => {
    if (selectedItem) {
      setMenuItems((prevItems) =>
        prevItems.filter((item) => item.id !== selectedItem.id)
      );
      setIsModalOpen(false);
    }
  };

  // Filter items by the selected category
  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : [];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Menu Items</h1>

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
                key={item.id}
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
          <div className="bg-white rounded p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {selectedItem ? "Edit Item" : "Add New Item"}
            </h2>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                value={modalName}
                onChange={(e) => setModalName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                value={modalPrice}
                onChange={(e) =>
                  setModalPrice(parseFloat(e.target.value))
                }
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
                  <div
                    key={ingredient}
                    className="flex items-center space-x-1"
                  >
                    <input
                      type="checkbox"
                      checked={modalIngredients.includes(ingredient)}
                      onChange={() =>
                        handleIngredientChange(ingredient)
                      }
                    />
                    <span>{ingredient}</span>
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
