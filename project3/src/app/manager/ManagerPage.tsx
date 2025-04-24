"use client";

import Link from "next/link";
import { LayoutDashboard, ReceiptText, Users, Package, Utensils, Monitor } from "lucide-react";

const managerOptions = [
  {
    title: "View Orders",
    icon: <ReceiptText size={32} />,
    href: "/manager/view_orders",
  },
  {
    title: "View Sales",
    icon: <LayoutDashboard size={32} />,
    href: "/manager/view_sales",
  },
  {
    title: "Manage Employees",
    icon: <Users size={32} />,
    href: "/manager/manage_employees",
  },
  {
    title: "Update Inventory",
    icon: <Package size={32} />,
    href: "/manager/update_inventory",
  },
  {
    title: "Update Menu Items",
    icon: <Utensils size={32} />,
    href: "/manager/update_menu_items",
  },
  {
    title: "Display Menu Boards",
    icon: <Monitor size={32} />,
    href: "/manager/menu_boards",
  },
  {
    title: "Set Happy Hour",
    icon: <Utensils size={32} />, // You can switch this to a clock or discount icon
    href: "/manager/set_happy_hour",
  },
];

export default function ManagerPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center w-full max-w-6xl">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {managerOptions.map(({ title, icon, href }) => (
            <Link key={title} href={href}>
              <div className="flex flex-col items-center justify-center bg-accent text-white rounded-xl p-6 cursor-pointer transition hover:scale-105 hover:bg-pink-900">
                {icon}
                <span className="mt-4 text-lg font-semibold text-center">{title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

