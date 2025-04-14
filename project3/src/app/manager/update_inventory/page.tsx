"use client";

import { useEffect, useState } from "react";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  cost: number;
  min_amount: number;
  items_sold: number;
}

export default function UpdateInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePopup, setActivePopup] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [editingMin, setEditingMin] = useState<number | null>(null);
  const [newMinValue, setNewMinValue] = useState("");
  const [filter, setFilter] = useState<"all" | "below" | "near">("all");
  const [showThresholds, setShowThresholds] = useState(false);
  const [nearThreshold, setNearThreshold] = useState(1.25);
  const [approachingThreshold, setApproachingThreshold] = useState(1.5);

  const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    red: { bg: "bg-red-100", text: "text-red-800", border: "border-red-500" },
    orange: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-500" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-500" },
    green: { bg: "bg-green-100", text: "text-green-800", border: "border-green-500" },
  };

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await fetch("/api/inventory");
        const data = await res.json();
        setInventory(data);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  const getStockStatus = (item: InventoryItem) => {
    const q = item.quantity;
    const min = item.min_amount;

    if (q < min) return { color: "red", label: "Below Minimum" };
    if (q < min * nearThreshold) return { color: "orange", label: "Near Minimum" };
    if (q < min * approachingThreshold) return { color: "yellow", label: "Approaching Minimum" };
    return { color: "green", label: "Stock Healthy" };
  };

  const handleAddMore = async (item: InventoryItem) => {
    const amountToAdd = parseInt(inputValue, 10);
    if (isNaN(amountToAdd) || amountToAdd <= 0) return;

    const newQuantity = item.quantity + amountToAdd;

    try {
      await fetch(`/api/inventory/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      setInventory((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i))
      );

      setActivePopup(null);
      setInputValue("");
    } catch (error) {
      console.error("Failed to update inventory quantity:", error);
    }
  };

  const handleUpdateMin = async (item: InventoryItem) => {
    const newMin = parseInt(newMinValue, 10);
    if (isNaN(newMin) || newMin <= 0) return;

    try {
      await fetch(`/api/inventory/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ min_amount: newMin }),
      });

      setInventory((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, min_amount: newMin } : i))
      );

      setEditingMin(null);
      setNewMinValue("");
    } catch (error) {
      console.error("Failed to update minimum amount:", error);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const status = getStockStatus(item);
    if (filter === "below") return status.color === "red";
    if (filter === "near") return status.color === "orange" || status.color === "yellow";
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-background">
      <h1 className="text-3xl font-bold text-center mb-6">Update Inventory</h1>

      {/* Toggle Threshold Settings */}
      <div className="mb-4 text-right max-w-4xl mx-auto">
        <button
          onClick={() => setShowThresholds(!showThresholds)}
          className="bg-gray-200 hover:bg-gray-300 text-sm font-medium px-4 py-2 rounded"
        >
          {showThresholds ? "Hide Threshold Settings" : "Customize Thresholds"}
        </button>
      </div>

      {showThresholds && (
        <div className="flex flex-wrap gap-4 items-center justify-end max-w-4xl mx-auto mb-4">
          <div>
            <label className="text-sm mr-2">Near Min (%):</label>
            <input
              type="number"
              min="1"
              max="2"
              step="0.05"
              className="border px-2 py-1 w-20 rounded"
              value={nearThreshold}
              onChange={(e) => setNearThreshold(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm mr-2">Approaching (%):</label>
            <input
              type="number"
              min="1"
              max="3"
              step="0.05"
              className="border px-2 py-1 w-20 rounded"
              value={approachingThreshold}
              onChange={(e) => setApproachingThreshold(parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Filter Dropdown */}
      <div className="mb-6 max-w-4xl mx-auto text-right">
        <label htmlFor="filter" className="mr-2 font-medium">
          Filter:
        </label>
        <select
          id="filter"
          className="border px-3 py-1 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">All Items</option>
          <option value="below">Below Minimum</option>
          <option value="near">Near/Approaching Minimum</option>
        </select>
      </div>

      {/* Inventory Items */}
      <div className="grid gap-4 max-w-4xl mx-auto">
        {filteredInventory.map((item) => {
          const status = getStockStatus(item);
          const style = STATUS_STYLES[status.color];

          return (
            <div
              key={item.id}
              className={`bg-white p-4 shadow rounded border-l-4 ${style.border}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xl font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Cost: ${item.cost.toFixed(2)}
                  </p>

                  {/* Editable Min Amount */}
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <span>Min Required:</span>
                    {editingMin === item.id ? (
                      <>
                        <input
                          type="number"
                          value={newMinValue}
                          onChange={(e) => setNewMinValue(e.target.value)}
                          className="w-16 border px-1 py-0.5 rounded text-sm"
                        />
                        <button
                          onClick={() => handleUpdateMin(item)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingMin(null);
                            setNewMinValue("");
                          }}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{item.min_amount}</span>
                        <button
                          onClick={() => {
                            setEditingMin(item.id);
                            setNewMinValue(item.min_amount.toString());
                          }}
                          className="text-blue-500 hover:underline text-sm"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">Items Sold: {item.items_sold}</p>
                  <p className="text-sm text-gray-800 mt-2 font-medium">
                    Current Stock: {item.quantity}
                  </p>
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-1 mt-1 rounded-full ${style.bg} ${style.text}`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Add More Popup */}
                <div className="flex flex-col items-end gap-2 relative">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                    onClick={() =>
                      setActivePopup(activePopup === item.id ? null : item.id)
                    }
                  >
                    Add More
                  </button>

                  {activePopup === item.id && (
                    <div className="absolute top-12 right-0 bg-white border shadow-md rounded p-3 z-10 w-48">
                      <input
                        type="number"
                        className="w-full border px-2 py-1 rounded mb-2"
                        placeholder="Enter amount"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <div className="flex justify-between gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded w-full"
                          onClick={() => handleAddMore(item)}
                        >
                          Confirm
                        </button>
                        <button
                          className="bg-gray-300 px-3 py-1 rounded w-full"
                          onClick={() => setActivePopup(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
