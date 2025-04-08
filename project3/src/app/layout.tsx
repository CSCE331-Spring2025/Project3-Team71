import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar.server";
import { CartProvider } from "@/components/CartContext";
import GoogleTranslate from "@/components/GoogleTranslate/GoogleTranslate"; // new component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tea71",
  description: "the best.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CartProvider>
          <NavBar />
          <GoogleTranslate />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
