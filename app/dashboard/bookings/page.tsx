"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  User,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  farmhouse_name: string;
  guest_name: string;
  guest_email: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_amount: number;
  status: string;
  special_requests: string;
  created_at: string;
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const checkAuthAndFetchBookings = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check if user is an owner
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!userData || userData.role !== "owner") {
        router.push("/");
        return;
      }

      await fetchBookings(user.id);
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          id,
          check_in_date,
          check_out_date,
          guests,
          total_amount,
          status,
          special_requests,
          created_at,
          farmhouses!inner(name, owner_id),
          users!inner(full_name, email)
        `
        )
        .eq("farmhouses.owner_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedBookings =
        data?.map((booking: any) => ({
          id: booking.id,
          farmhouse_name: booking.farmhouses.name,
          guest_name: booking.users.full_name || "Guest",
          guest_email: booking.users.email,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          guests: booking.guests,
          total_amount: booking.total_amount,
          status: booking.status,
          special_requests: booking.special_requests,
          created_at: booking.created_at,
        })) || [];

      setBookings(formattedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.farmhouse_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.guest_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );

      toast({
        title: "Booking Updated",
        description: `Booking ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
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

  const getStatusActions = (booking: Booking) => {
    switch (booking.status) {
      case "pending":
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => updateBookingStatus(booking.id, "confirmed")}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateBookingStatus(booking.id, "cancelled")}
            >
              Decline
            </Button>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => updateBookingStatus(booking.id, "completed")}
              variant="outline"
            >
              Mark Complete
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateBookingStatus(booking.id, "cancelled")}
            >
              Cancel
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <span className="text-xl font-bold text-green-800">
                FarmStay Oasis
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/dashboard/properties">
                <Button variant="ghost">Properties</Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Manage reservations for your properties
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by property, guest name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria"
                : "Bookings will appear here once guests start booking your properties"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {booking.farmhouse_name}
                      </CardTitle>
                      <p className="text-gray-600">
                        Booking #{booking.id.slice(0, 8)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{booking.guest_name}</p>
                        <p className="text-sm text-gray-600">
                          {booking.guest_email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">
                          {new Date(booking.check_in_date).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            booking.check_out_date
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.guests} guests
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">${booking.total_amount}</p>
                        <p className="text-sm text-gray-600">Total amount</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Booked</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {booking.special_requests && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium text-sm">
                            Special Requests:
                          </p>
                          <p className="text-sm text-gray-700">
                            {booking.special_requests}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    {getStatusActions(booking)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
