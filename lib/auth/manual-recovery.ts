/**
 * Manual Auth Recovery Guide
 * Use these methods to recover your auth tokens
 */

import { createClient } from "@/lib/supabase/client";

// Method 1: Complete reset (recommended)
export function completeAuthReset() {
  console.log("🔄 Starting complete auth reset...");

  // Clear all storage
  localStorage.clear();
  sessionStorage.clear();

  // Clear cookies (if any)
  document.cookie.split(";").forEach((c) => {
    const eqPos = c.indexOf("=");
    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });

  console.log("✅ All auth data cleared. Please login again.");

  // Redirect to login
  window.location.href = "/auth/login";
}

// Method 2: Restore from valid session data
export function restoreFromSessionData(sessionData: {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: any;
}) {
  console.log("🔄 Restoring session from provided data...");

  const authData = {
    access_token: sessionData.access_token,
    refresh_token: sessionData.refresh_token,
    expires_at: sessionData.expires_at || Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: sessionData.user,
  };

  // Clear old data first
  localStorage.removeItem("supabase.auth.token");

  // Set new data
  localStorage.setItem("supabase.auth.token", JSON.stringify(authData));

  console.log("✅ Session restored. Reloading page...");
  window.location.reload();
}

// Method 3: Try to refresh current session
export async function attemptSessionRefresh() {
  console.log("🔄 Attempting to refresh current session...");

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error("❌ Session refresh failed:", error);
      console.log("💡 Try completeAuthReset() instead");
      return false;
    }

    if (data.session) {
      console.log("✅ Session refreshed successfully!");
      window.location.reload();
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Session refresh error:", error);
    return false;
  }
}

// Method 4: Check what's currently in storage
export function debugAuthState() {
  console.log("🔍 Current auth state:");

  const authToken = localStorage.getItem("supabase.auth.token");
  if (authToken) {
    try {
      const parsed = JSON.parse(authToken);
      console.log("📄 Auth token found:");
      console.log("  - Has access_token:", !!parsed.access_token);
      console.log("  - Has refresh_token:", !!parsed.refresh_token);
      console.log("  - Expires at:", new Date(parsed.expires_at * 1000));
      console.log("  - User ID:", parsed.user?.id);
    } catch (e) {
      console.log("❌ Auth token is corrupted");
    }
  } else {
    console.log("❌ No auth token found");
  }

  console.log("📦 All localStorage keys:", Object.keys(localStorage));
}

// Make functions available globally
if (typeof window !== "undefined") {
  (window as any).completeAuthReset = completeAuthReset;
  (window as any).restoreFromSessionData = restoreFromSessionData;
  (window as any).attemptSessionRefresh = attemptSessionRefresh;
  (window as any).debugAuthState = debugAuthState;

  console.log("🔧 Auth recovery methods available:");
  console.log(
    "  - completeAuthReset() - Clear everything and redirect to login"
  );
  console.log("  - attemptSessionRefresh() - Try to refresh current session");
  console.log("  - debugAuthState() - Check current auth state");
  console.log(
    "  - restoreFromSessionData({access_token, refresh_token, user}) - Restore from backup"
  );
}
