"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function OwnerRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Get user role from database
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        // If user is an owner, redirect to dashboard
        if (profile?.role === "owner") {
          router.push("/dashboard");
        }
      }
    };

    checkUserAndRedirect();
  }, [router]);

  return null; // This component doesn't render anything
}
