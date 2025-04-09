import { auth } from "@/auth";
import NavBarClient from "./NavBar.client";
import pool from "@/lib/db";

const NavBar = async () => {
  // Get session data on the server side
  const session = await auth();

  // if user is a manager by searching in managers table
  const isManager = session?.user?.email
  ? (await pool.query(`SELECT * FROM managers WHERE email = $1`, [session.user.email])).rowCount > 0
  : undefined;


  // Pass session data to the client component
  return <NavBarClient session={session} isManager={isManager} />;
};

export default NavBar;