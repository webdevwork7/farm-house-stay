import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: any = null;

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
        // Add error handling for corrupted tokens
        onAuthStateChange: (event, session) => {
          if (event === "TOKEN_REFRESHED" && !session) {
            // If token refresh failed, clear corrupted data
            console.log("Token refresh failed - clearing auth data");
            if (typeof window !== "undefined") {
              localStorage.removeItem("supabase.auth.token");
              localStorage.removeItem("sb-urhxgnzljgnvzmirpquz-auth-token");
              sessionStorage.clear();
            }
          }
        },
      },
      global: {
        headers: {
          "X-Client-Info": "supabase-js-web",
        },
      },
    });
  }

  return supabaseClient;
}
