'use server'
import { signIn, signOut } from "@/auth";

export async function doLogin(formData) {
  const action = formData.get("action");
  const redirectPage = action === "employee" ? "/" : "/manager";

  try {
    const response = await signIn("google", { redirectTo: redirectPage });

    if (!response?.user?.email) {
      throw new Error("No email found in sign-in response.");
    }

    const email = response.user.email;
    const name = response.user.name || "Unknown User"; // Fallback name
    const tableName = action === "employee" ? "employees" : "managers";
    const now = new Date(); // Current timestamp

    // Check if the user already exists in the table
    const checkUserQuery = `SELECT * FROM ${tableName} WHERE email = $1`;
    const result = await pool.query(checkUserQuery, [email]);

    if (result.rows.length === 0) {
      // Insert new user
      const insertUserQuery = `
        INSERT INTO ${tableName} (name, email, last_sign_in) 
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      await pool.query(insertUserQuery, [name, email, now]);
      console.log(`${action} added to database: ${name} (${email})`);
    } else {
      // Update last_sign_in timestamp
      const updateUserQuery = `
        UPDATE ${tableName} 
        SET last_sign_in = $1 
        WHERE email = $2;
      `;
      await pool.query(updateUserQuery, [now, email]);
      console.log(`${action} last_sign_in updated: ${email}`);
    }

    console.log("Sign in response:", response);
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}