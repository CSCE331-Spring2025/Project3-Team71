"use server";
import ManagerPage from "./ManagerPage";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ManagerPageWrapper() {
  const session = await auth();

  // redirect to home screen if not logged in
  if (!session) {
    redirect("/");
  }

  const email = session?.user?.email;
  const name = session?.user?.name || "Unknown";
  const now = new Date();

  if (email) {
    try {
      const { rows } = await pool.query(`SELECT * FROM managers WHERE email = $1`, [email]);

      if (rows.length === 0) {
        await pool.query(
          `INSERT INTO managers (name, email, last_sign_in) VALUES ($1, $2, $3)`,
          [name, email, now]
        );
        console.log("Inserted new manager");
      } else {
        await pool.query(
          `UPDATE managers SET last_sign_in = $1 WHERE email = $2`,
          [now, email]
        );
        console.log("Updated manager login");
      }
    } catch (error) {
      console.error("Manager DB error:", error);
    }
  }

  return <ManagerPage />;
}
