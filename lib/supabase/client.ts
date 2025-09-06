import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Create a singleton instance to avoid multiple client creations
let supabaseInstance: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  console.log("Creating new Supabase client instance");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    throw new Error("Missing Supabase environment variables");
  }

  try {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        storageKey: "supabase.auth.token",
        // Increase token refresh buffer to ensure token is refreshed before expiry
        autoRefreshTimeBeforeExpiry: 60, // Refresh token 60 seconds before expiry
      },
      global: {
        headers: {
          "X-Client-Info": "supabase-js-web",
        },
      },
    });
    
    console.log("Supabase client created successfully");
    return supabaseInstance;
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    throw error;
  }
}
