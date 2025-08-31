import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, Session } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  // Create singleton client to avoid auth state issues
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storage:
          typeof window !== "undefined" ? window.localStorage : undefined,
        storageKey: "supabase.auth.token",
      },
      global: {
        headers: {
          "X-Client-Info": "supabase-js-web",
        },
      },
    });

    // Set up auth state change listener separately
    if (typeof window !== "undefined") {
      supabaseClient.auth.onAuthStateChange(
        (event: string, session: Session | null) => {
          if (event === "TOKEN_REFRESHED" && !session) {
            // If token refresh failed, clear corrupted data
            console.log("Token refresh failed - clearing auth data");
            localStorage.removeItem("supabase.auth.token");
            localStorage.removeItem("sb-urhxgnzljgnvzmirpquz-auth-token");
            sessionStorage.clear();
          }
        }
      );
    }
  }

  return supabaseClient;
}
