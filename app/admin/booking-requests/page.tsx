"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Filter,
  Calendar,
  Users,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import AdminNavbar from "@/components/AdminNavbar";

interface BookingRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  check_in: string;
  check_out: string;
  guests: number;
  special_requests: string | null;
  status: "pending" | "contacted" | "converted" | "cancelled";
  created_at: string;
  updated_at: string;
}

export default function BookingRequestsPage() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BookingRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const requestsPerPage = 10;

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  useEffect(() => {
    filterAndSortRequests();
  }, [requests, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchBookingRequests = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("booking_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching booking requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch booking requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRequests = () => {
    let filtered = [...requests];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.phone.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof BookingRequest];
      let bValue: any = b[sortBy as keyof BookingRequest];

      if (
        sortBy === "created_at" ||
        sortBy === "check_in" ||
        sortBy === "check_out"
      ) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const updateRequestStatus = async (
    requestId: string,
    newStatus: BookingRequest["status"]
  ) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("booking_requests")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      // Update local state
      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : request
        )
      );

      toast({
        title: "Status Updated",
        description: `Request status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: BookingRequest["status"]) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      contacted: { color: "bg-blue-100 text-blue-800", icon: UserCheck },
      converted: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return nights;
  };

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const startIndex = (currentPage - 1) * requestsPerPage;
  const endIndex = startIndex + requestsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600">Loading booking requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Requests
          </h1>
          <p className="text-gray-600">
            Manage and track all booking requests from your landing page
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter((r) => r.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contacted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter((r) => r.status === "contacted").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Converted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter((r) => r.status === "converted").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label
                  htmlFor="search"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Search Requests
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="w-full md:w-48">
                <Label
                  htmlFor="status-filter"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Filter by Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-48">
                <Label
                  htmlFor="sort-by"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Sort By
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="check_in">Check-in Date</SelectItem>
                    <SelectItem value="guests">Guests</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Requests ({filteredRequests.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center space-x-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentRequests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No booking requests found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Booking requests will appear here when customers submit the form"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th
                        className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        Customer Details
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer"
                        onClick={() => handleSort("check_in")}
                      >
                        Stay Details
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        Status
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer"
                        onClick={() => handleSort("created_at")}
                      >
                        Requested On
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              {request.name}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{request.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{request.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>
                                {format(new Date(request.check_in), "MMM dd")} -{" "}
                                {format(
                                  new Date(request.check_out),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>
                                {request.guests} guests •{" "}
                                {calculateNights(
                                  request.check_in,
                                  request.check_out
                                )}{" "}
                                nights
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {format(new Date(request.created_at), "MMM dd, yyyy")}
                          <br />
                          <span className="text-xs text-gray-500">
                            {format(new Date(request.created_at), "hh:mm a")}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>

                            {request.status === "pending" && (
                              <Select
                                value={request.status}
                                onValueChange={(value) =>
                                  updateRequestStatus(
                                    request.id,
                                    value as BookingRequest["status"]
                                  )
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="contacted">
                                    Contacted
                                  </SelectItem>
                                  <SelectItem value="converted">
                                    Converted
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredRequests.length)} of{" "}
                  {filteredRequests.length} requests
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Details Modal */}
        {showDetails && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Booking Request Details</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Customer Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <p className="font-medium">{selectedRequest.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{selectedRequest.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <p className="font-medium">{selectedRequest.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Stay Details
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Check-in:</span>
                        <p className="font-medium">
                          {format(
                            new Date(selectedRequest.check_in),
                            "MMMM dd, yyyy"
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Check-out:
                        </span>
                        <p className="font-medium">
                          {format(
                            new Date(selectedRequest.check_out),
                            "MMMM dd, yyyy"
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Guests:</span>
                        <p className="font-medium">
                          {selectedRequest.guests} guests
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Duration:</span>
                        <p className="font-medium">
                          {calculateNights(
                            selectedRequest.check_in,
                            selectedRequest.check_out
                          )}{" "}
                          nights
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedRequest.special_requests && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Special Requests
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedRequest.special_requests}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className="mt-1">
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Requested On:</span>
                    <p className="font-medium">
                      {format(
                        new Date(selectedRequest.created_at),
                        "MMMM dd, yyyy 'at' hh:mm a"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t">
                  <Select
                    value={selectedRequest.status}
                    onValueChange={(value) => {
                      updateRequestStatus(
                        selectedRequest.id,
                        value as BookingRequest["status"]
                      );
                      setSelectedRequest({
                        ...selectedRequest,
                        status: value as BookingRequest["status"],
                      });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => window.open(`tel:${selectedRequest.phone}`)}
                    className="flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Customer</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(`mailto:${selectedRequest.email}`)
                    }
                    className="flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
