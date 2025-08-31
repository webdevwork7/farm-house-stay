"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

interface NavbarProps {
  currentPage?: string;
}

export default function Navbar({ currentPage = "home" }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get current user and their role
    const getUserAndRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Get user role from database
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }
    };

    // Get site settings
    const getSiteSettings = async () => {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("key", "site_name")
        .single();

      if (settings?.value) {
        setSiteName(settings.value);
      }
    };

    getUserAndRole();
    getSiteSettings();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        // Get user role when auth state changes
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();

      // Clear local state immediately
      setUser(null);
      setUserRole(null);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out error:", error);
      }

      // Force redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      // Force redirect even if there's an error
      window.location.href = "/";
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo siteName={siteName} size="md" showText={false} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors cursor-pointer ${
                currentPage === "home"
                  ? "text-green-600 font-medium"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/properties"
              className={`transition-colors cursor-pointer ${
                currentPage === "properties"
                  ? "text-green-600 font-medium"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Properties
            </Link>
            <Link
              href="/about"
              className={`transition-colors cursor-pointer ${
                currentPage === "about"
                  ? "text-green-600 font-medium"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`transition-colors cursor-pointer ${
                currentPage === "contact"
                  ? "text-green-600 font-medium"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Only show Dashboard link for owners */}
                {userRole === "owner" && (
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="text-green-700 hover:text-green-800 cursor-pointer"
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-gray-800 cursor-pointer"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-green-700 hover:text-green-800 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-green-100 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === "home"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/properties"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === "properties"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === "about"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === "contact"
                    ? "text-green-600 bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-green-100 space-y-2">
                {user ? (
                  <>
                    {/* Only show Dashboard link for owners */}
                    {userRole === "owner" && (
                      <Link href="/dashboard">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-green-700 hover:text-green-800"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start text-gray-700 hover:text-gray-800"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-green-700 hover:text-green-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
