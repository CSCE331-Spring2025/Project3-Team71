import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [Google],
  // Other NextAuth configuration options (e.g., callbacks, sessions, etc.)
};

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(authOptions);