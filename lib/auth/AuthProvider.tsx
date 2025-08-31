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
    // Auto-recover corrupted auth state on mount
    autoRecoverAuth();

    const supabase = createClient();

    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log("Auth loading timeout - clearing corrupted auth state");
      clearAllAuthData();
      setLoading(false);
    }, 5000); // 5 second timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        // Clear timeout since we got a response
        clearTimeout(loadingTimeout);

        if (error) {
          console.error("Session error:", error);
          // If there's an auth error, clear corrupted tokens
          clearAllAuthData();
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          await fetchUserRole(session.user.id);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        // Clear corrupted auth data
        clearAllAuthData();
      } finally {
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);

      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setUserRole(null);
        clearAllAuthData();
      } else if (event === "TOKEN_REFRESHED" && !session) {
        // Token refresh failed - clear corrupted data
        console.log("Token refresh failed - clearing corrupted auth data");
        setUser(null);
        setUserRole(null);
        clearAllAuthData();
      } else if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      setUserRole(profile?.role || null);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole(null);
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
