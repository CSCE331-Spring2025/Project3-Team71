"use client";

import { useState } from "react";

interface Order {
  id: number;
  order_date: string;
  items?: string[];
  total?: number;
}


export default function ViewOrdersPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from the API with optional date filters
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build a query string with the selected dates
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      // Example endpoint: /api/orders
      const response = await fetch(`/api/viewOrders?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data: Order[] = await response.json();
      setOrders(data);
      console.log("Fetched orders:", data[0].items); // Debugging line
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">View Orders</h1>

      {/* Date Filters */}
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Start Date</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold">End Date</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && <p className="mb-4">Loading orders...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left font-bold">Order ID</th>
                <th className="py-2 px-4 text-left font-bold">Order Date</th>
                <th className="py-2 px-4 text-left font-bold">Items</th>
                <th className="py-2 px-4 text-left font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-2 px-4">{order.id}</td>
                  <td className="py-2 px-4">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {order.items?.length
                      ? order.items.join(", ")
                      : "No items"}
                  </td>
                  <td className="py-2 px-4">{order.total?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p>No orders found for the selected date range.</p>
      )}
    </div>
  );
}
