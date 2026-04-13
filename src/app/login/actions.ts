"use server";

import { signIn } from "@/auth";

export async function signInWithGitHub(callbackUrl?: string) {
  await signIn("github", {
    redirectTo: callbackUrl || "/dashboard",
  });
}
