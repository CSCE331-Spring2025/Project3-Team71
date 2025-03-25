import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mt-4 px-4 py-2 flex items-center justify-between relative">

      <div className="absolute right-4">
        <button className="btn-primary my-2 text-white p-2 rounded bg-blue-500">
          <Link href="/login">Login</Link>
        </button>
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
    </nav>
  );
};

export default NavBar;
