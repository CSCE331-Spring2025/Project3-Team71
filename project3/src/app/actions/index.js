'use server';
import { signIn, signOut } from "@/auth";

export async function doLogin(formData) {
  const action = formData.get("action");
  const redirectPage = action === "employee" ? "/" : "/manager";
  return signIn("google", { redirectTo: `${redirectPage}?action=${action}` });
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}