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
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mt-4 px-4 py-2 flex items-center justify-between relative">
      <div className="absolute left-4 relative">
        {!session?.user ? (
          <button className="btn-primary my-2 text-white p-2 rounded bg-blue-500">
            <Link href="/login">Login</Link>
          </button>
        ) : (
          <div className="relative">
            <button onClick={() => setModalOpen(!modalOpen)}>
              <Image
                src={session.user?.image} 
                alt={session.user?.name || 'User'}
                width={35}
                height={35}
                className='rounded-full'
              />
            </button>
            {modalOpen && 
            <div className=" absolute bg-white p-6 rounded-lg w-80 shadow-lg z-10">
                <h2 className="text-xl font-bold mb-4">Welcome {session.user?.name}</h2>
                <Logout />
            </div>
            }
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

      <div className="absolute right-4">
        <ShoppingCart size={24} />
      </div>
    </nav>
  );
};

export default NavBarClient;