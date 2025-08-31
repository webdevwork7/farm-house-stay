"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { autoRecoverAuth, clearAllAuthData } from "./recovery";
import LoadingFallback from "@/components/LoadingFallback";
import "./manual-recovery";

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        // Auto-recover corrupted auth state on mount
        autoRecoverAuth();

        const supabase = createClient();

        // Get initial session with retry logic
        let retryCount = 0;
        const maxRetries = 3;

        const getSessionWithRetry = async (): Promise<any> => {
          try {
            const {
              data: { session },
              error,
            } = await supabase.auth.getSession();

            if (error) {
              console.error("Session error:", error);
              if (retryCount < maxRetries) {
                retryCount++;
                console.log(
                  `Retrying session fetch (${retryCount}/${maxRetries})`
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return getSessionWithRetry();
              } else {
                clearAllAuthData();
                return null;
              }
            }

            return session;
          } catch (error) {
            console.error("Error getting session:", error);
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(
                `Retrying session fetch (${retryCount}/${maxRetries})`
              );
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return getSessionWithRetry();
            } else {
              clearAllAuthData();
              return null;
            }
          }
        };

        const session = await getSessionWithRetry();

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            await fetchUserRole(session.user.id);
          } else {
            setUser(null);
            setUserRole(null);
          }
          setLoading(false);
          // Clear loading marker on successful auth
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("auth_loading_start");
          }
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth event:", event, session?.user?.id);

          if (!mounted) return;

          if (event === "SIGNED_OUT" || !session) {
            setUser(null);
            setUserRole(null);
            if (event === "SIGNED_OUT") {
              clearAllAuthData();
            }
          } else if (event === "TOKEN_REFRESHED") {
            if (session?.user) {
              setUser(session.user);
              await fetchUserRole(session.user.id);
            } else {
              // Token refresh failed
              console.log("Token refresh failed - clearing auth data");
              setUser(null);
              setUserRole(null);
              clearAllAuthData();
            }
          } else if (session?.user) {
            setUser(session.user);
            await fetchUserRole(session.user.id);
          }

          if (mounted) {
            setLoading(false);
            // Clear loading marker
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("auth_loading_start");
            }
          }
        });

        authSubscription = subscription;
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          clearAllAuthData();
          setLoading(false);
        }
      }
    };

    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.log("Auth loading timeout - setting loading to false");
        setLoading(false);
      }
    }, 8000); // 8 second timeout

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const supabase = createClient();

      // Add retry logic for database calls
      let retryCount = 0;
      const maxRetries = 2; // Reduced retries

      const fetchWithRetry = async (): Promise<any> => {
        try {
          const { data: profile, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();

          if (error) {
            // Handle expected errors silently
            if (
              error.code === "PGRST116" ||
              error.message?.includes("No rows returned")
            ) {
              // User doesn't exist in users table yet - this is expected for new users
              console.log(
                "User not found in users table, setting default role"
              );
              return { role: "visitor" };
            }

            // Only log unexpected errors
            if (
              error.code !== "PGRST116" &&
              !error.message?.includes("No rows returned")
            ) {
              console.warn("User role fetch error:", error.message);
            }

            if (retryCount < maxRetries && error.code !== "PGRST116") {
              retryCount++;
              await new Promise((resolve) => setTimeout(resolve, 500));
              return fetchWithRetry();
            }
            return { role: "visitor" };
          }

          return profile;
        } catch (error: any) {
          // Only log actual connection/network errors
          if (
            error.message?.includes("fetch") ||
            error.message?.includes("network")
          ) {
            console.warn("Database connection issue:", error.message);
            if (retryCount < maxRetries) {
              retryCount++;
              await new Promise((resolve) => setTimeout(resolve, 500));
              return fetchWithRetry();
            }
          }
          return { role: "visitor" };
        }
      };

      const profile = await fetchWithRetry();
      setUserRole(profile?.role || "visitor");
    } catch (error: any) {
      // Silent fallback - don't log expected errors
      setUserRole("visitor");
    }
  };

  const clearAuthStorage = () => {
    if (typeof window !== "undefined") {
      // Clear all possible Supabase auth keys
      const keysToRemove = [
        "supabase.auth.token",
        "sb-urhxgnzljgnvzmirpquz-auth-token",
        "supabase-auth-token",
        "sb-auth-token",
      ];

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      // Clear all session storage
      sessionStorage.clear();

      console.log("Cleared all auth storage");
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();

      // Clear state immediately
      setUser(null);
      setUserRole(null);
      clearAllAuthData();

      // Sign out from Supabase
      await supabase.auth.signOut({ scope: "global" });

      // Force page reload
      window.location.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);
      window.location.replace("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signOut }}>
      {loading ? <LoadingFallback /> : children}
    </AuthContext.Provider>
  );
}
