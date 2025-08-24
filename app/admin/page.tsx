"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Users,
  Home,
  Calendar,
  DollarSign,
  Settings,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  pendingApprovals: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check if user is admin
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      // If user exists and is admin, proceed
      if (userData && userData.role === "admin") {
        setUser(user);
        await fetchAdminStats();
        return;
      }

      // If user doesn't exist but email is admin@gmail.com, they should have access
      if (user.email === "admin@gmail.com") {
        setUser(user);
        await fetchAdminStats();
        return;
      }

      // Otherwise, deny access
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      router.push("/");
      return;
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const supabase = createClient();

      // Fetch all stats
      const [usersData, propertiesData, bookingsData] = await Promise.all([
        supabase.from("users").select("id"),
        supabase.from("farmhouses").select("id"),
        supabase.from("bookings").select("total_amount, status"),
      ]);

      const totalUsers = usersData.data?.length || 0;
      const totalProperties = propertiesData.data?.length || 0;
      const totalBookings = bookingsData.data?.length || 0;
      const totalRevenue =
        bookingsData.data?.reduce(
          (sum, booking) => sum + (booking.total_amount || 0),
          0
        ) || 0;
      const pendingApprovals =
        bookingsData.data?.filter((b) => b.status === "pending").length || 0;

      setStats({
        totalUsers,
        totalProperties,
        totalBookings,
        totalRevenue,
        pendingApprovals,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-red-800">
                Admin Dashboard
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/admin/users">
                <Button variant="ghost">Users</Button>
              </Link>
              <Link href="/admin/properties">
                <Button variant="ghost">Properties</Button>
              </Link>
              <Link href="/admin/bookings">
                <Button variant="ghost">Bookings</Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="ghost">Settings</Button>
              </Link>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    toast({
                      title: "Signed Out Successfully",
                      description: "Admin session ended. Redirecting to home.",
                    });
                    router.push("/");
                  } catch (error) {
                    toast({
                      title: "Sign Out Failed",
                      description: "There was an error signing you out.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage your FarmStay Oasis platform from here.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalUsers}
              </div>
              <p className="text-sm text-gray-600">Registered users</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <Home className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalProperties}
              </div>
              <p className="text-sm text-gray-600">Listed farmstays</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalBookings}
              </div>
              <p className="text-sm text-yellow-600 font-medium">
                {stats.pendingApprovals} pending
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ₹{stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Platform revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Manage user accounts, roles, and permissions.
              </p>
              <Link href="/admin/users">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-green-600" />
                <span>Property Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Review and manage all listed properties.
              </p>
              <Link href="/admin/properties">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Manage Properties
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <span>Site Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Configure site settings and preferences.
              </p>
              <Link href="/admin/settings">
                <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                  Site Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
