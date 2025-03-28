"use client";

import Link from "next/link";

export default function ManagerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
      {/* Button to navigate to the menu boards page */}
      <Link href="/manager/menu_boards">
        <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Show Menu Boards
        </button>
      </Link>
    </div>
  );
}
