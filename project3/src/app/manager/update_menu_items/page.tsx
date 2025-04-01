"use client";

import { useState } from "react";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
}

export default function ManageMenuItemsPage() {
  // Hardcoded sample data with multiple items per category
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: "Classic Milk Tea", category: "Milk Tea", price: 4.5 },
    { id: 5, name: "Honey Milk Tea", category: "Milk Tea", price: 5.0 },
    { id: 6, name: "Matcha Milk Tea", category: "Milk Tea", price: 5.25 },
    { id: 2, name: "Matcha Latte", category: "Fresh Milk", price: 5.25 },
    { id: 7, name: "Vanilla Fresh Milk", category: "Fresh Milk", price: 5.0 },
    { id: 3, name: "Peach Mojito", category: "Mojitos", price: 4.5 },
    { id: 8, name: "Strawberry Mojito", category: "Mojitos", price: 4.75 },
    { id: 4, name: "Berry Fruit Tea", category: "Fruit Tea", price: 4.75 },
    { id: 9, name: "Mango Fruit Tea", category: "Fruit Tea", price: 4.5 },
  ]);

  // Derive the list of categories
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  // State for which category is selected
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalName, setModalName] = useState("");
  const [modalPrice, setModalPrice] = useState<number>(0);

  // Open modal for an existing item or to add a new item
  const openModal = (item?: MenuItem) => {
    if (item) {
      setSelectedItem(item);
      setModalName(item.name);
      setModalPrice(item.price);
    } else {
      // New item defaults (ID will be generated)
      setSelectedItem(null);
      setModalName("");
      setModalPrice(0);
    }
    setIsModalOpen(true);
  };

  // Save the item (update or add)
  const saveItem = () => {
    if (selectedItem) {
      // Update existing item
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id ? { ...item, name: modalName, price: modalPrice } : item
        )
      );
    } else {
      // Add new item (generate new ID)
      const newId =
        menuItems.length > 0 ? Math.max(...menuItems.map((item) => item.id)) + 1 : 1;
      const newItem: MenuItem = {
        id: newId,
        name: modalName,
        category: selectedCategory || "Uncategorized",
        price: modalPrice,
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
              className="px-6 py-3 bg-accent text-white rounded hover:bg-white transition"
            >
              Add New Item
            </button>
          </div>
        </div>
      )}

      {/* Modal for Customizing/Deleting an Item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                onChange={(e) => setModalPrice(parseFloat(e.target.value))}
                className="w-full border p-2 rounded"
              />
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
