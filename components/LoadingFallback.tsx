"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { forceAuthRecovery } from "@/lib/auth/recovery";
import { RefreshCw, AlertCircle } from "lucide-react";

interface LoadingFallbackProps {
  timeout?: number;
}

export default function LoadingFallback({
  timeout = 8000,
}: LoadingFallbackProps) {
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRecovery(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (!showRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Taking Too Long?
          </h2>
          <p className="text-gray-600">
            This might be due to corrupted authentication data. Click below to
            fix it.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => forceAuthRecovery()}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Fix Authentication Issues
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            Try Reloading Page
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          This will clear your login session and redirect you to the home page.
        </p>
      </div>
    </div>
  );
}
