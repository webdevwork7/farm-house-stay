"use client";

import { useEffect } from "react";
import {
  checkAuthHealth,
  clearAllAuthData,
  detectStuckState,
} from "@/lib/auth/recovery";

export function useAuthRecovery() {
  useEffect(() => {
    // Check for stuck state on component mount
    if (detectStuckState()) {
      console.log("🔧 Detected stuck state, clearing auth data");
      clearAllAuthData();
      window.location.reload();
      return;
    }

    // Check auth health periodically
    const healthCheck = setInterval(() => {
      if (!checkAuthHealth()) {
        console.log("🔧 Auth health check failed, clearing corrupted data");
        clearAllAuthData();
        window.location.reload();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(healthCheck);
  }, []);

  // Return recovery functions for manual use
  return {
    forceRecovery: () => {
      clearAllAuthData();
      window.location.reload();
    },
    checkHealth: checkAuthHealth,
  };
}
