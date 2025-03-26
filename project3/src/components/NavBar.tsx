import Link from "next/link";
import Image from "next/image";
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Logout from '@/components/Logout'
import { ShoppingCart } from "lucide-react";

const NavBar = async ({ params }) => {

  const session = await auth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mt-4 px-4 py-2 flex items-center justify-between relative">

      <div className="absolute left-4">
        {!(session?.user) ? (
          <button className="btn-primary my-2 text-white p-2 rounded bg-blue-500">
            <Link href="/login">Login</Link>
          </button>
          ) :
          <Image
            src={session?.user?.image}
            alt={session?.user?.name}
            width={35}
            height={50}
            className='rounded-full'
          />
        }

        
        
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

export default NavBar;
