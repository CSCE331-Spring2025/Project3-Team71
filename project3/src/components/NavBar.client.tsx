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
                          <ul className="max-h-48 overflow-y-auto space-y-2 w-full">
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
                                    <p className="text-xs text-gray-500">
                                      Ice: {item.customization.ice}
                                      {item.customization.removedIngredients.length > 0 && (
                                        <> | -{item.customization.removedIngredients.join(", ")}</>
                                      )}
                                    </p>
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
                              alert("Order placed!");
                              clearCart();
                            }}
                            className="mt-3 w-full bg-blue-500 text-white py-2 rounded"
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
    </nav>
  );
};

export default NavBarClient;