import { auth } from "@/auth";
import NavBarClient from "./NavBar.client";
import pool from "@/lib/db";

const NavBar = async () => {
  const session = await auth();
  const email = session?.user?.email;

  // If email is missing, safely return default
  if (!email) {
    return <NavBarClient session={session} isManager={false} />;
  }

  // TypeScript now knows email is definitely a string here
  const result = await pool.query(`SELECT * FROM managers WHERE email = $1`, [email]);
  const isManager = (result.rowCount as number) > 0;

  return <NavBarClient session={session} isManager={isManager} />;
};

export default NavBar;
