"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AdminNavbarProps {
  currentPage?: string;
}

export default function AdminNavbar({ currentPage }: AdminNavbarProps) {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();

      // Clear all auth-related localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem("sb-urhxgnzljgnvzmirpquz-auth-token");
        sessionStorage.clear();
      }

      await supabase.auth.signOut({ scope: "global" });

      toast({
        title: "Signed Out Successfully",
        description: "You have been logged out from admin panel.",
      });

      // Force page reload to clear all state
      window.location.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign Out Failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
      // Force redirect even if there's an error
      window.location.replace("/");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/admin"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Image
              src="https://zrzgqsfudgsbnrcmmfvk.supabase.co/storage/v1/object/public/images/logos/logo-1752963729950.png"
              alt="Farm Feast Farm House Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-xl font-bold text-red-800">Admin Panel</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button
                variant={currentPage === "dashboard" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button
                variant={currentPage === "users" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                Users
              </Button>
            </Link>
            <Link href="/admin/properties">
              <Button
                variant={currentPage === "properties" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                Properties
              </Button>
            </Link>
            <Link href="/admin/bookings">
              <Button
                variant={currentPage === "bookings" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                Bookings
              </Button>
            </Link>
            <Link href="/admin/booking-requests">
              <Button
                variant={
                  currentPage === "booking-requests" ? "default" : "ghost"
                }
                className="cursor-pointer"
              >
                Booking Requests
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button
                variant={currentPage === "settings" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                Settings
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="cursor-pointer text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
