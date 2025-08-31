/**
 * Auth Recovery Utilities
 * Use these functions to recover from corrupted auth state
 */

export function clearAllAuthData() {
  if (typeof window === "undefined") return;

  console.log("🔧 Clearing all auth data...");

  // Clear all possible Supabase auth keys
  const keysToRemove = [
    "supabase.auth.token",
    "sb-urhxgnzljgnvzmirpquz-auth-token",
    "supabase-auth-token",
    "sb-auth-token",
  ];

  // Clear from localStorage
  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
    console.log(`Removed ${key} from localStorage`);
  });

  // Clear from sessionStorage
  keysToRemove.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  // Clear all session storage
  sessionStorage.clear();

  console.log("✅ All auth data cleared");
}

export function forceAuthRecovery() {
  console.log("🚨 Force auth recovery initiated");

  clearAllAuthData();

  // Force page reload to reset auth state
  window.location.replace("/");
}

export function checkAuthHealth() {
  if (typeof window === "undefined") return true;

  const authToken = localStorage.getItem("supabase.auth.token");

  if (!authToken) {
    console.log("✅ No auth token found - clean state");
    return true;
  }

  try {
    const parsed = JSON.parse(authToken);

    if (!parsed.refresh_token || !parsed.access_token) {
      console.log("❌ Corrupted auth token detected - missing refresh_token");
      return false;
    }

    console.log("✅ Auth token appears healthy");
    return true;
  } catch (error) {
    console.log("❌ Failed to parse auth token - corrupted");
    return false;
  }
}

// Auto-recovery function that runs on page load
export function autoRecoverAuth() {
  if (!checkAuthHealth()) {
    console.log("🔧 Auto-recovering corrupted auth state");
    clearAllAuthData();
  }
}

// Make recovery functions available globally for manual use
if (typeof window !== "undefined") {
  (window as any).fixAuth = forceAuthRecovery;
  (window as any).clearAuth = clearAllAuthData;
  (window as any).checkAuth = checkAuthHealth;

  console.log("🔧 Auth recovery commands available:");
  console.log("  - fixAuth() - Force auth recovery and reload");
  console.log("  - clearAuth() - Clear all auth data");
  console.log("  - checkAuth() - Check auth health");
}
