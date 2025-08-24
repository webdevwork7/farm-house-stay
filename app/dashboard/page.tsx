"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Home,
  Calendar,
  DollarSign,
  Plus,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Clock,
  Star,
  MessageSquare,
  Bell,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  averageRating: number;
  occupancyRate: number;
  responseRate: number;
}

interface RecentBooking {
  id: string;
  farmhouse_name: string;
  guest_name: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  status: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
}

export default function OwnerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    averageRating: 0,
    occupancyRate: 0,
    responseRate: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topProperties, setTopProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
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

      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          full_name:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",
          role: "visitor",
        });

        if (!insertError) {
          router.push("/");
          return;
        }
      }

      if (!userData || userData.role !== "owner") {
        router.push("/");
        return;
      }

      setUser(user);
      await Promise.all([fetchDashboardData(user.id), fetchSiteSettings()]);
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const supabase = createClient();
      const { data: settings } = await supabase
        .from("site_settings")
        .select("key, value");

      const settingsMap: Record<string, string> = {
        site_name: "FarmStay Oasis",
        contact_phone: "+91 99999 88888",
        contact_email: "info@farmstayoasis.com",
      };

      settings?.forEach((setting) => {
        settingsMap[setting.key] = setting.value;
      });

      setSiteSettings(settingsMap);

      // Update site name in the DOM
      const siteNameElement = document.getElementById("site-name");
      if (siteNameElement) {
        siteNameElement.textContent = settingsMap.site_name || "FarmStay Oasis";
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  };

  const fetchDashboardData = async (userId: string) => {
    try {
      const supabase = createClient();

      // Fetch properties stats
      const { data: properties } = await supabase
        .from("farmhouses")
        .select("*")
        .eq("owner_id", userId);

      const totalProperties = properties?.length || 0;
      const activeProperties =
        properties?.filter((p) => p.is_active).length || 0;

      // Fetch bookings stats
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*, farmhouses!inner(owner_id)")
        .eq("farmhouses.owner_id", userId);

      const totalBookings = bookings?.length || 0;
      const pendingBookings =
        bookings?.filter((b) => b.status === "pending").length || 0;
      const confirmedBookings =
        bookings?.filter((b) => b.status === "confirmed").length || 0;
      const totalRevenue =
        bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue =
        bookings
          ?.filter((b) => {
            const bookingDate = new Date(b.created_at);
            return (
              bookingDate.getMonth() === currentMonth &&
              bookingDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // Calculate weekly revenue (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyRevenue =
        bookings
          ?.filter((b) => new Date(b.created_at) >= weekAgo)
          .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // Calculate occupancy rate (simplified)
      const occupancyRate =
        totalProperties > 0
          ? Math.min((confirmedBookings / (totalProperties * 30)) * 100, 100)
          : 0;

      // Generate monthly data for the last 6 months
      const monthlyDataArray: MonthlyData[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthBookings =
          bookings?.filter((b) => {
            const bookingDate = new Date(b.created_at);
            return (
              bookingDate.getMonth() === date.getMonth() &&
              bookingDate.getFullYear() === date.getFullYear()
            );
          }) || [];

        monthlyDataArray.push({
          month: date.toLocaleDateString("en-US", { month: "short" }),
          revenue: monthBookings.reduce(
            (sum, b) => sum + (b.total_amount || 0),
            0
          ),
          bookings: monthBookings.length,
        });
      }

      setStats({
        totalProperties,
        activeProperties,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue,
        averageRating: 4.7, // Mock data
        occupancyRate: Math.round(occupancyRate),
        responseRate: 95, // Mock data
      });

      setMonthlyData(monthlyDataArray);

      // Fetch recent bookings with farmhouse names
      const { data: recentBookingsData } = await supabase
        .from("bookings")
        .select(
          `
          id,
          check_in_date,
          check_out_date,
          total_amount,
          status,
          farmhouses!inner(name, owner_id),
          users!inner(full_name)
        `
        )
        .eq("farmhouses.owner_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      const formattedBookings =
        recentBookingsData?.map((booking: any) => ({
          id: booking.id,
          farmhouse_name: booking.farmhouses.name,
          guest_name: booking.users.full_name || "Guest",
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          total_amount: booking.total_amount,
          status: booking.status,
        })) || [];

      setRecentBookings(formattedBookings);

      // Fetch top 3 properties based on bookings and revenue
      const { data: topPropertiesData } = await supabase
        .from("farmhouses")
        .select(
          `
          id,
          name,
          location,
          price_per_night,
          images,
          is_active,
          bookings(total_amount, status)
        `
        )
        .eq("owner_id", userId)
        .eq("is_active", true)
        .limit(10);

      // Calculate top properties based on total revenue
      const propertiesWithStats =
        topPropertiesData?.map((property: any) => {
          const confirmedBookings =
            property.bookings?.filter((b: any) => b.status === "confirmed") ||
            [];
          const totalRevenue = confirmedBookings.reduce(
            (sum: number, b: any) => sum + (b.total_amount || 0),
            0
          );
          const totalBookings = confirmedBookings.length;

          return {
            ...property,
            totalRevenue,
            totalBookings,
            averageBookingValue:
              totalBookings > 0 ? totalRevenue / totalBookings : 0,
          };
        }) || [];

      // Sort by total revenue and take top 3
      const sortedProperties = propertiesWithStats
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 3);

      setTopProperties(sortedProperties);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRevenueChange = () => {
    if (monthlyData.length >= 2) {
      const currentMonth = monthlyData[monthlyData.length - 1].revenue;
      const lastMonth = monthlyData[monthlyData.length - 2].revenue;
      if (lastMonth === 0) return 0;
      return Math.round(((currentMonth - lastMonth) / lastMonth) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const revenueChange = getRevenueChange();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar
        currentPage="dashboard"
        siteName={siteSettings.site_name}
      />

      {/* Navigation Actions */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end items-center h-12 space-x-4">
            <Link href="/dashboard/analytics">
              <Button variant="ghost" className="cursor-pointer">
                Analytics
              </Button>
            </Link>
            <Link href="/dashboard/properties">
              <Button variant="ghost" className="cursor-pointer">
                Properties
              </Button>
            </Link>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" className="cursor-pointer">
                Bookings
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="cursor-pointer">
                Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              className="relative bg-transparent cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stats.pendingBookings}
              </span>
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={async () => {
                try {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  toast({
                    title: "Signed Out Successfully",
                    description: "You have been logged out. See you soon!",
                  });
                  router.push("/");
                } catch (error) {
                  toast({
                    title: "Sign Out Failed",
                    description:
                      "There was an error signing you out. Please try again.",
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your properties.
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm text-green-600 font-medium">
                {stats.activeProperties} active
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ₹{stats.monthlyRevenue.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1">
                {revenueChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p
                  className={`text-sm font-medium ${
                    revenueChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {revenueChange >= 0 ? "+" : ""}
                  {revenueChange}% from last month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupancy Rate
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.occupancyRate}%
              </div>
              <p className="text-sm text-gray-600">This month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.averageRating}
              </div>
              <p className="text-sm text-gray-600">Across all properties</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.totalBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.pendingBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.responseRate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/dashboard/properties/new">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Property
                  </Button>
                </Link>
                <Link href="/dashboard/properties">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent justify-start"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Manage Properties
                  </Button>
                </Link>
                <Link href="/dashboard/bookings">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Bookings
                    {stats.pendingBookings > 0 && (
                      <Badge className="ml-auto bg-yellow-100 text-yellow-800">
                        {stats.pendingBookings}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/dashboard/analytics">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent justify-start"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/dashboard/calendar">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Booking Calendar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Top Properties */}
            <Card className="border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Top Properties</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topProperties.length === 0 ? (
                  <div className="text-center py-4">
                    <Home className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No properties yet</p>
                    <p className="text-xs text-gray-500">
                      Add properties to see top performers
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topProperties.map((property, index) => (
                      <div
                        key={property.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">
                            {property.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {property.location}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs font-medium text-green-600">
                              ₹{property.totalRevenue.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              • {property.totalBookings} bookings
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card className="border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <span>Revenue Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.slice(-3).map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">
                        {data.month}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (data.revenue /
                                  Math.max(
                                    ...monthlyData.map((d) => d.revenue)
                                  )) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          ₹{data.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Bookings */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Recent Bookings</span>
                  </CardTitle>
                  <Link href="/dashboard/bookings">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No bookings yet</p>
                    <p className="text-sm text-gray-500">
                      Bookings will appear here once guests start booking your
                      properties
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">
                            {booking.farmhouse_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Guest: {booking.guest_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              booking.check_in_date
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              booking.check_out_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-bold text-lg text-gray-900">
                            ₹{booking.total_amount.toLocaleString()}
                          </p>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Properties Section - Full Width */}
        <div className="mt-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Top Performing Properties</span>
                </CardTitle>
                <Link href="/dashboard/properties">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    View All Properties
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {topProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No properties yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add properties to see your top performers here
                  </p>
                  <Link href="/dashboard/properties/new">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Property
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {topProperties.map((property, index) => (
                    <div
                      key={property.id}
                      className="relative bg-gradient-to-br from-white to-gray-50 border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Ranking Badge */}
                      <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        #{index + 1}
                      </div>

                      {/* Property Image */}
                      <div className="mb-4">
                        {property.images && property.images.length > 0 ? (
                          <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={property.images[0]}
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Home className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Property Details */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 truncate">
                            {property.name}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {property.location}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-green-600">
                              ₹{property.totalRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-700 font-medium">
                              Total Revenue
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-blue-600">
                              {property.totalBookings}
                            </p>
                            <p className="text-xs text-blue-700 font-medium">
                              Bookings
                            </p>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>₹{property.price_per_night}/night</span>
                          {property.averageBookingValue > 0 && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              Avg: ₹{Math.round(property.averageBookingValue)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
