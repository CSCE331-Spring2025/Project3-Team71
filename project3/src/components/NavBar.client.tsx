'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Logout from '@/components/Logout';

interface NavBarClientProps {
  session: Session | null;
}

const NavBarClient = ({ session }: NavBarClientProps) => {
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);

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
                src={session.user?.image} 
                alt={session.user?.name || 'User'}
                width={35}
                height={35}
                className='rounded-full'
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
        <button onClick={() => setCartModalOpen(!cartModalOpen)}>
            <ShoppingCart size={24} />
        </button>
        
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
                    {/* Cart items would go here */}
                    <p className="text-center">No items in your cart.</p>
                    <button className="bg-blue-500 text-white p-2 rounded mt-4" onClick={() => setCartModalOpen(false)}>Checkout</button>
                </div>
            </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarClient;