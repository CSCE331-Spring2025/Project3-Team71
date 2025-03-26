import { auth } from "@/auth";
import NavBarClient from "./NavBar.client";

const NavBar = async () => {
  // Get session data on the server side
  const session = await auth();

  // Pass session data to the client component
  return <NavBarClient session={session} />;
};

export default NavBar;