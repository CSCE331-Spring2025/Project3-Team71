"use client";

import Link from "next/link";

export default function ManagerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-8 text-center">
        Manager Dashboard
      </h1>

      {/* Button Container */}
      <div className="flex flex-col w-full max-w-2xl space-y-4 mx-auto">
        <Link href="/manager/view_orders">
          <button className="w-full text-4xl text-white bg-accent py-4 rounded hover:bg-pink-900 transition-colors">
            View Orders
          </button>
        </Link>
        <Link href="/manager/view_sales">
          <button className="w-full text-4xl text-white bg-accent py-4 rounded hover:bg-pink-900 transition-colors">
            View Sales
          </button>
        </Link>
        <Link href="/manager/manage_employees">
          <button className="w-full text-4xl text-white bg-accent py-4 rounded hover:bg-pink-900 transition-colors">
            Manage Employees
          </button>
        </Link>
        <Link href="/manager/update_inventory">
          <button className="w-full text-4xl text-white bg-accent py-4 rounded hover:bg-pink-900 transition-colors">
            Update Inventory
          </button>
        </Link>
        <Link href="/manager/update_menu_items">
          <button className="w-full text-4xl text-white bg-accent py-4 rounded hover:bg-pink-900 transition-colors">
            Update Menu Items
          </button>
        </Link>
        <Link href="/manager/menu_boards">
          <button className="w-full text-4xl text-white bg-accent py-4 rounded hover:bg-pink-900 transition-colors">
            Display Menu Boards
          </button>
        </Link>
      </div>
    </div>
  );
}
