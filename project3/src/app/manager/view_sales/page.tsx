"use client";

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface IngredientUsage {
  ingredient: string;
  usage_count: number;
}

interface SalesData {
  item: string;
  total_sales: number;
}

interface XReportData {
  hour: string;
  total_sales: number;
}

interface ZReportData {
  total_sales: number; 
  total_profits: number;
}

export default function ViewSalesPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [ingredientUsageData, setIngredientUsageData] = useState<IngredientUsage[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [xReportData, setXReportData] = useState<XReportData[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  const [zReportData, setZReportData] = useState<ZReportData | null>(null);

  const fetchProductUsage = async () => {
    if (!startDate || !endDate) {
      setError("Must enter start and end date for Product Usage");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("startDate", startDate);
      queryParams.append("endDate", endDate);
  
      const response = await fetch(`/api/viewSales/productUsage?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch product usage');
      const data = await response.json();
      setIngredientUsageData(data);
      setSalesData([]);
      setXReportData([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchSalesReport = async () => {
    if (!startDate || !endDate) {
      setError("Must enter start and end date for Sales Report");
      return;
    }
  
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("startDate", startDate);
      queryParams.append("endDate", endDate);
  
      const response = await fetch(`/api/viewSales/salesReport?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch sales report');
      const data = await response.json();
      setSalesData(data);
      setIngredientUsageData([]);
      setXReportData([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchZReport = async () => {
    const confirmRun = window.confirm("Are you sure you would like to run the Z report? This will reset all daily totals.");
    if (!confirmRun) return;
  
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/viewSales/zReport', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to run Z Report');
  
      const data = await response.json();
      setZReportData({
        total_sales: parseFloat(data.total_sales), // Parse as number
        total_profits: parseFloat(data.total_profits), // Parse as number
      });
      setIngredientUsageData([]);
      setSalesData([]);
      setXReportData([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchXReport = async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/viewSales/xReport?date=${date}`);
      if (!response.ok) throw new Error('Failed to fetch X Report');
    
      const data = await response.json();
      console.log("X Report data:", data);  // <-- Debugging log

      if (data && data.length > 0) {
        setXReportData(data);
        setIngredientUsageData([]);
        setSalesData([]);
      } else {
        setXReportData([]);  // Clear if no data is returned
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatePickerClose = (date: string) => {
    if (!date) {
      setError("Must select a date for X Report");
      setIsDatePickerOpen(false);
      return;
    }
  
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    fetchXReport(date); // Fetch the X report data after selecting the date
  };

  return (
    <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">View Sales</h1>

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
        className="btn-primary"
      >
        Product Usage
      </button>

      <button
        onClick={fetchSalesReport}
        className="btn-primary"
      >
        Sales Report
      </button>

      <button
        onClick={() => setIsDatePickerOpen(true)}
        className="btn-primary"
      >
        X Report
      </button>
      
      <button
        onClick={fetchZReport}
        className="btn-primary"
      >
        Z Report
      </button>
    </div>

    {isDatePickerOpen && (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-background bg-opacity-50 flex justify-center items-center z-10">
        <div className="bg-white p-4 rounded shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Select Date for X Report</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsDatePickerOpen(false)}
              className="btn-primary"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDatePickerClose(selectedDate)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )}

    {isLoading && <p>Loading data...</p>}
    {error && <p className="text-red-500">{error}</p>}

    {ingredientUsageData.length > 0 && (
      <div className="mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Product Usage</h2>
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

    {salesData.length > 0 && (
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Sales Report</h2>
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left font-bold">Item ID</th>
              <th className="py-2 px-4 text-left font-bold">Total Sales ($)</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{item.item}</td>
                <td className="py-2 px-4">{item.total_sales.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {xReportData.length > 0 && (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Hourly Sales (X Report)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={xReportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_sales" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}

    {/* Z report Table */}
    {zReportData && (
      <div className="mt-8">
        {/* Optional success banner */}
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          Z Report loaded successfully!
        </div>

        <h2 className="text-xl font-semibold mb-4">Z Report</h2>
        <table className="min-w-[300px] bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left font-bold">Metric</th>
              <th className="py-2 px-4 text-left font-bold">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">Total Sales</td>
              <td className="py-2 px-4">{zReportData.total_sales.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-2 px-4">Total Profits</td>
              <td className="py-2 px-4">{zReportData.total_profits.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )}

    {ingredientUsageData.length === 0 && salesData.length === 0 && xReportData.length === 0 && !isLoading && (
      <p>No data available for the selected range.</p>
    )}
  </div>
);
}