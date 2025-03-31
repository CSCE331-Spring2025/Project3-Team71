import NextAuth, {User} from "next-auth";
import Google from "next-auth/providers/google";
import pool from "@/lib/db";

export const authOptions = {
  providers: [Google],
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user?.email) return false; // Ensure email exists

      const email = user.email;
      const name = user.name || "Unknown User"; // Fallback name
      const now = new Date(); // Current timestamp

      try {
        // Check if user exists in employees or managers table
        const checkEmployeeQuery = "SELECT * FROM employees WHERE email = $1";
        const checkManagerQuery = "SELECT * FROM managers WHERE email = $1";

        const [employeeResult, managerResult] = await Promise.all([
          pool.query(checkEmployeeQuery, [email]),
          pool.query(checkManagerQuery, [email]),
        ]);

        if (employeeResult.rows.length === 0 && managerResult.rows.length === 0) {
          // If user is neither an employee nor a manager, assume employee by default
          const insertUserQuery = `
            INSERT INTO employees (name, email, last_sign_in) 
            VALUES ($1, $2, $3)
          `;
          await pool.query(insertUserQuery, [name, email, now]);
          console.log(`New employee added: ${name} (${email})`);
        } else {
          // Update last_sign_in timestamp in the correct table
          const updateTable = employeeResult.rows.length > 0 ? "employees" : "managers";
          const updateUserQuery = `
            UPDATE ${updateTable} 
            SET last_sign_in = $1 
            WHERE email = $2;
          `;
          await pool.query(updateUserQuery, [now, email]);
          console.log(`${updateTable} last_sign_in updated: ${email}`);
        }
      } catch (error) {
        console.error("Database error during sign-in:", error);
      }

      return true; // Allow sign-in
    },
  },
};

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(authOptions);
