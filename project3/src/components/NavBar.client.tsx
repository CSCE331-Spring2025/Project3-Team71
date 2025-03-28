'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Logout from '@/components/Logout';

interface NavBarClientProps {
  session: Session | null;
}

const NavBarClient = ({ session }: NavBarClientProps) => {
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const { cart, removeFromCart, clearCart, setCart } = useCart();
  const increaseQuantity = (index: number) => {
    const updated = [...cart];
    updated[index].quantity += 1;
    setCart(updated);
  };
  
  const decreaseQuantity = (index: number) => {
    const updated = [...cart];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      setCart(updated);
    } else {
      removeFromCart(index); // auto-remove if quantity hits 0
    }
  };
  const total = cart.reduce(
    (sum, item) => sum + (item.sell_price || 0) * item.quantity,
    0
  );
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);



  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mt-4 px-4 py-2 flex items-center justify-between relative">
      <div className="absolute left-4 relative">
        {!session?.user ? (
          <button className="btn-primary my-2 text-white p-2 rounded bg-blue-500">
            <Link href="/login">Login</Link>
          </button>
        ) : (
          <div className="relative">
            <button onClick={() => setAccountModalOpen(!accountModalOpen)}>
            <Image
              src={(session.user?.image || '/default-avatar.png') as string}
              alt={session.user?.name || 'User'}
              width={35}
              height={35}
            />
            </button>
            {accountModalOpen && (
                <div className="absolute top-full mt-2 left-0">
                    <div className="absolute -top-2 left-2 w-0 h-0 
                        border-l-8 border-l-transparent 
                        border-b-8 border-b-white 
                        border-r-8 border-r-transparent 
                        z-20"  // Ensure it's above other elements
                    />
                    
                    <div className="relative flex flex-col bg-white p-6 items-center rounded-lg w-80 shadow-lg z-10">
                        <h2 className="text-xl font-bold mb-4">Welcome {session.user?.name}</h2>
                        <Logout />
                    </div>
                </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <a className="navbar-brand text-lg font-bold" href="/">
          <Image
            src='/images/ShareTeaLogo.png'
            alt='logo'
            width={140}
            height={72}
          />
        </a>
      </div>

      <div className="absolute right-8">
      <div className="relative">
          <button onClick={() => setCartModalOpen(!cartModalOpen)}>
            <ShoppingCart size={24} />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
        
        {cartModalOpen && (
            <div className="absolute top-full mt-2 right-0">
                <div className="absolute -top-2 right-2 w-0 h-0 
                    border-l-8 border-l-transparent 
                    border-b-8 border-b-white 
                    border-r-8 border-r-transparent 
                    z-20"
                />
                
                <div className="relative flex flex-col bg-white p-6 items-center rounded-lg w-80 shadow-lg z-10">
                    <h2 className="text-xl font-bold mb-4">Your Cart</h2>
                    {cart.length === 0 ? (
                    <p className="text-sm text-gray-500">Your cart is empty.</p>
                      ) : (
                        <>
                          <ul className="max-h-[70vh] overflow-y-auto space-y-2 w-full">
                            {cart.map((item, index) => (
                              <li key={index} className="border-b pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-semibold">{item.item_name}</p>
                                    <p className="text-sm text-gray-600">
                                      ${item.sell_price?.toFixed(2)}
                                    </p>
                                    {item.quantity > 1 && (
                                      <p className="text-xs text-gray-500">
                                        × {item.quantity} = ${(item.sell_price! * item.quantity).toFixed(2)}
                                      </p>
                                    )}
                                    <div className="flex items-center mt-1 gap-2">
                                      <button
                                        onClick={() => decreaseQuantity(index)}
                                        className="bg-gray-200 text-gray-700 px-2 rounded"
                                      >
                                        –
                                      </button>
                                      <span className="text-sm">{item.quantity}</span>
                                      <button
                                        onClick={() => increaseQuantity(index)}
                                        className="bg-gray-200 text-gray-700 px-2 rounded"
                                      >
                                        +
                                      </button>
                                    </div>
                                    {(
                                      item.customization.ice !== "Medium" ||
                                      item.customization.sweetness !== "Normal" ||
                                      item.customization.teaType !== "Green tea" ||
                                      item.customization.removedIngredients.length > 0 ||
                                      item.customization.toppings.length > 0
                                    ) && (
                                      <div className="text-xs text-yellow-700 mt-1 italic">
                                        * Customization:
                                        <ul className="list-disc list-inside">
                                          {item.customization.ice !== "Medium" && <li>Ice: {item.customization.ice}</li>}
                                          {item.customization.sweetness !== "Normal" && <li>Sweetness: {item.customization.sweetness}</li>}
                                          {item.customization.teaType !== "Green tea" && <li>Tea Type: {item.customization.teaType}</li>}
                                          {item.customization.removedIngredients.length > 0 && (
                                            <li>Removed: {item.customization.removedIngredients.join(", ")}</li>
                                          )}
                                          {item.customization.toppings.length > 0 && (
                                            <li>Toppings: {item.customization.toppings.join(", ")}</li>
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => removeFromCart(index)}
                                    className="text-red-500 text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 font-bold text-right w-full">Total: ${total.toFixed(2)}</div>
                          <button
                            onClick={() => {
                              if (cart.length === 0) return; // Prevent opening checkout
                              setCartModalOpen(false);
                              setCheckoutModalOpen(true);
                            }}
                            className={`mt-3 w-full py-2 rounded ${
                              cart.length === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                            disabled={cart.length === 0}
                          >
                            Checkout
                          </button>
                          <button
                            onClick={clearCart}
                            className="mt-2 w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-50"
                          >
                            Clear Cart
                          </button>
                        </>
                      )}

                </div>
            </div>
        )}
      </div>
      {checkoutModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl shadow-xl relative">
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4">Checkout</h2>

              <ul className="space-y-3 max-h-100 overflow-y-auto mb-4">
                {cart.map((item, index) => (
                  <li key={index} className="border p-3 rounded">
                  <p className="font-semibold">{item.item_name}</p>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    ${item.sell_price?.toFixed(2)}
                    <span className="mx-2">×</span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decreaseQuantity(index)}
                        className="bg-gray-200 text-gray-700 px-2 rounded"
                      >
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(index)}
                        className="bg-gray-200 text-gray-700 px-2 rounded"
                      >
                        +
                      </button>
                    </div>

                    <span className="ml-auto font-medium">
                      = ${(item.sell_price! * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {(
                    item.customization.ice !== "Medium" ||
                    item.customization.sweetness !== "Normal" ||
                    item.customization.teaType !== "Green tea" ||
                    item.customization.removedIngredients.length > 0 ||
                    item.customization.toppings.length > 0
                  ) && (
                    <div className="text-xs text-yellow-700 mt-1 italic">
                      * Customization:
                      <ul className="list-disc list-inside">
                        {item.customization.ice !== "Medium" && <li>Ice: {item.customization.ice}</li>}
                        {item.customization.sweetness !== "Normal" && <li>Sweetness: {item.customization.sweetness}</li>}
                        {item.customization.teaType !== "Green tea" && <li>Tea Type: {item.customization.teaType}</li>}
                        {item.customization.removedIngredients.length > 0 && (
                          <li>Removed: {item.customization.removedIngredients.join(", ")}</li>
                        )}
                        {item.customization.toppings.length > 0 && (
                          <li>Toppings: {item.customization.toppings.join(", ")}</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 text-xs mt-2"
                  >
                    Remove
                  </button>
                </li>
                ))}
              </ul>

              <div className="font-bold text-right mb-4">
                Total: $
                {cart.reduce((sum, item) => sum + item.quantity * (item.sell_price || 0), 0).toFixed(2)}
              </div>

              <div className="flex flex-col gap-2">
              <button
                onClick={async () => {
                  if (cart.length === 0) return;

                  const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      items: cart.map((item) => ({
                        menuItemId: item.item_id,
                        quantity: item.quantity,
                      })),
                    }),
                  });

                  const data = await res.json();

                  if (data.success) {
                    alert("Order placed!");
                    clearCart();
                    setCheckoutModalOpen(false);
                  } else {
                    alert("Checkout failed: " + data.error);
                  }
                }}
                disabled={cart.length === 0}
                className={`w-full py-2 rounded ${
                  cart.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Confirm Order
              </button>


          <button
            onClick={() => {
              setCheckoutModalOpen(false);
              setCartModalOpen(true);
            }}
            className="w-full border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50"
          >
            Return to Cart
          </button>
        </div>
            </div>
          </div>
        )}
    </nav>
  );
};

export default NavBarClient;