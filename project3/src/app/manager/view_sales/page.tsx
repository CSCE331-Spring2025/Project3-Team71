"use client"; // Mark this as a client-side component

import React, { useState } from 'react';

interface IngredientUsage {
  ingredient: string;
  usage_count: number;
}

export default function ViewSalesPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [ingredientUsageData, setIngredientUsageData] = useState<IngredientUsage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product usage data from the API based on the selected dates
  const fetchProductUsage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters for the selected dates
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      // Call the API to get product usage data
      const response = await fetch(`/api/viewSales?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch product usage');
      }

      const data = await response.json();
      setIngredientUsageData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">View Sales</h1>

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
          onClick={fetchProductUsage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Product Usage
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && <p>Loading product usage...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table to display ingredient usage data */}
      {ingredientUsageData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left font-bold">Ingredient</th>
                <th className="py-2 px-4 text-left font-bold">Usage Count</th>
              </tr>
            </thead>
            <tbody>
              {ingredientUsageData.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.ingredient}</td>
                  <td className="py-2 px-4">{item.usage_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* If no data available */}
      {ingredientUsageData.length === 0 && !isLoading && (
        <p>No product usage data available for the selected range.</p>
      )}
    </div>
  );
}