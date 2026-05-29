import { supabase } from "@/lib/supabase";

export function getAuthCallbackUrl() {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.location.origin}/auth/callback`;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthCallbackUrl(),
    },
  });
  if (error) {
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
