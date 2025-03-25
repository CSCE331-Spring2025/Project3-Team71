'use server'
import { signIn, signOut } from "@/auth";

export async function doLogin(formData) {
  const action = formData.get('action');
  const redirectPage = action === "employee" ? "/employee" : "/manager";
  
  try {
    const response = await signIn("google", { 
      redirectTo: redirectPage 
    });

    console.log("Sign in response:", response);
  } catch (error) {
        console.error("Sign in error:", error);
        throw error;
    }
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}