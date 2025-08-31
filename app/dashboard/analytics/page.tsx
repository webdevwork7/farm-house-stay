"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Star,
  Eye,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";

interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  totalBookings: number;
  monthlyBookings: number;
  weeklyBookings: number;
  averageBookingValue: number;
  occupancyRate: number;
  averageRating: number;
  totalViews: number;
  monthlyViews: number;
  conversionRate: number;
  revenueGrowth: number;
  bookingGrowth: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
  views: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    totalBookings: 0,
    monthlyBookings: 0,
    weeklyBookings: 0,
    averageBookingValue: 0,
    occupancyRate: 0,
    averageRating: 0,
    totalViews: 0,
    monthlyViews: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    bookingGrowth: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndFetchAnalytics();
  }, []);

  const checkAuthAndFetchAnalytics = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!userData || userData.role !== "owner") {
        router.push("/");
        return;
      }

      await fetchAnalyticsData(user.id);
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async (userId: string) => {
    try {
      const supabase = createClient();

      // Fetch bookings data
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*, farmhouses!inner(owner_id)")
        .eq("farmhouses.owner_id", userId);

      const totalBookings = bookings?.length || 0;
      const totalRevenue =
        bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // Calculate monthly data
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyBookings =
        bookings?.filter((b) => {
          const bookingDate = new Date(b.created_at);
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear
          );
        }) || [];

      const monthlyRevenue = monthlyBookings.reduce(
        (sum, b) => sum + (b.total_amount || 0),
        0
      );

      // Calculate weekly data
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyBookings =
        bookings?.filter((b) => new Date(b.created_at) >= weekAgo) || [];
      const weeklyRevenue = weeklyBookings.reduce(
        (sum, b) => sum + (b.total_amount || 0),
        0
      );

      // Calculate growth rates (mock data for now)
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthBookings =
        bookings?.filter((b) => {
          const bookingDate = new Date(b.created_at);
          return (
            bookingDate.getMonth() === lastMonth.getMonth() &&
            bookingDate.getFullYear() === lastMonth.getFullYear()
          );
        }) || [];

      const lastMonthRevenue = lastMonthBookings.reduce(
        (sum, b) => sum + (b.total_amount || 0),
        0
      );
      const revenueGrowth =
        lastMonthRevenue > 0
          ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0;
      const bookingGrowth =
        lastMonthBookings.length > 0
          ? ((monthlyBookings.length - lastMonthBookings.length) /
              lastMonthBookings.length) *
            100
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
          views: Math.floor(Math.random() * 1000) + 500, // Mock data
        });
      }

      setAnalytics({
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue,
        totalBookings,
        monthlyBookings: monthlyBookings.length,
        weeklyBookings: weeklyBookings.length,
        averageBookingValue:
          totalBookings > 0 ? totalRevenue / totalBookings : 0,
        occupancyRate: Math.floor(Math.random() * 30) + 60, // Mock data
        averageRating: 4.7, // Mock data
        totalViews: Math.floor(Math.random() * 5000) + 2000, // Mock data
        monthlyViews: Math.floor(Math.random() * 1000) + 500, // Mock data
        conversionRate: Math.floor(Math.random() * 10) + 5, // Mock data
        revenueGrowth: Math.round(revenueGrowth),
        bookingGrowth: Math.round(bookingGrowth),
      });

      setMonthlyData(monthlyDataArray);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar currentPage="analytics" siteName="FarmStay Oasis" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">
                Detailed insights into your property performance
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ₹{analytics.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {analytics.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p
                  className={`text-sm font-medium ${
                    analytics.revenueGrowth >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {analytics.revenueGrowth >= 0 ? "+" : ""}
                  {analytics.revenueGrowth}% from last month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {analytics.totalBookings}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {analytics.bookingGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p
                  className={`text-sm font-medium ${
                    analytics.bookingGrowth >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {analytics.bookingGrowth >= 0 ? "+" : ""}
                  {analytics.bookingGrowth}% from last month
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
                {analytics.occupancyRate}%
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
                {analytics.averageRating}
              </div>
              <p className="text-sm text-gray-600">Across all properties</p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Average Booking Value</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{Math.round(analytics.averageBookingValue).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Per booking</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>Total Views</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.totalViews.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                {analytics.monthlyViews} this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Conversion Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.conversionRate}%
              </div>
              <p className="text-sm text-gray-600">Views to bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance Chart */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Monthly Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {data.month}
                    </span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600">
                        ₹{data.revenue.toLocaleString()}
                      </span>
                      <span className="text-blue-600">
                        {data.bookings} bookings
                      </span>
                      <span className="text-purple-600">
                        {data.views} views
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (data.revenue /
                              Math.max(...monthlyData.map((d) => d.revenue))) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (data.bookings /
                              Math.max(...monthlyData.map((d) => d.bookings))) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-semibold">
                  ₹{analytics.monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Week</span>
                <span className="font-semibold">
                  ₹{analytics.weeklyRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average per Booking</span>
                <span className="font-semibold">
                  ₹{Math.round(analytics.averageBookingValue).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {analytics.monthlyBookings} bookings
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Week</span>
                <Badge className="bg-green-100 text-green-800">
                  {analytics.weeklyBookings} bookings
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Occupancy Rate</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {analytics.occupancyRate}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
