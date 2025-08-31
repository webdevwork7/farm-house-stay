"use client";

import type React from "react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific Supabase login errors with beautiful toasts
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "🔐 Invalid Credentials",
            description:
              "The email or password you entered is incorrect. Please try again.",
            variant: "destructive",
          });
          setError("Invalid email or password. Please check your credentials.");
          return;
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "📧 Email Not Verified",
            description:
              "Please check your email and click the verification link before signing in.",
            variant: "destructive",
          });
          setError("Please verify your email address before signing in.");
          return;
        } else if (error.message.includes("Too many requests")) {
          toast({
            title: "⏰ Too Many Attempts",
            description:
              "Too many login attempts. Please wait a moment and try again.",
            variant: "destructive",
          });
          setError("Too many login attempts. Please wait and try again.");
          return;
        } else if (error.message.includes("Invalid email")) {
          toast({
            title: "📧 Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive",
          });
          setError("Please enter a valid email address.");
          return;
        }
        throw error;
      }

      if (data.user) {
        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role, full_name")
          .eq("id", data.user.id)
          .single();

        // Success toast with user's name
        const userName =
          profile?.full_name || data.user.email?.split("@")[0] || "User";
        toast({
          title: `🎉 Welcome back, ${userName}!`,
          description:
            "You've been successfully signed in. Redirecting you now...",
          duration: 3000,
        });

        // If profile exists, redirect based on role
        if (profile && !profileError) {
          if (profile.role === "admin") {
            router.push("/admin");
            router.refresh();
          } else if (profile.role === "owner") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        } else {
          // If no profile exists and it's admin email, just redirect to admin
          if (email === "admin@gmail.com") {
            router.push("/admin");
            router.refresh();
          } else {
            // For other users, try to create profile
            const { error: insertError } = await supabase.from("users").insert({
              id: data.user.id,
              email: data.user.email,
              full_name:
                data.user.user_metadata?.full_name ||
                data.user.email?.split("@")[0] ||
                "User",
              role: "visitor",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

            // Ignore duplicate key errors
            if (insertError && !insertError.message.includes("duplicate key")) {
              console.error("Error creating user profile:", insertError);
            }

            router.push("/");
          }
        }
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "❌ Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Sign In - Farm Feast Farm House</title>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navbar currentPage="login" />

        <div className="flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-green-800">
                  Welcome Back
                </CardTitle>
                <CardDescription>
                  Sign in to your FarmStay Oasis account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                <div className="mt-6 text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
