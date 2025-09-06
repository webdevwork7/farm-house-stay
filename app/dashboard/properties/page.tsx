"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import { getPropertySlug } from "@/lib/utils/slug";

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
}

export default function PropertiesManagement() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const supabase = createClient();

  // Fetch properties function
  const fetchProperties = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("farmhouses")
          .select("*")
          .eq("owner_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setProperties(data || []);
        setFilteredProperties(data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  // Check authentication and role
  const checkAuthAndRole = useCallback(async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/auth/login");
        return null;
      }

      // Check if user is an owner
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userError || !userData || userData.role !== "owner") {
        router.push("/");
        return null;
      }

      return user;
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/auth/login");
      return null;
    }
  }, [supabase, router]);

  // Main initialization effect
  useEffect(() => {
    let mounted = true;

    const initializeComponent = async () => {
      // Wait a bit to ensure auth state is ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!mounted) return;

      const user = await checkAuthAndRole();
      setAuthChecked(true);

      if (user && mounted) {
        await fetchProperties(user.id);
      }
    };

    initializeComponent();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session?.user) {
        const user = await checkAuthAndRole();
        if (user && mounted) {
          await fetchProperties(user.id);
        }
      } else if (event === "SIGNED_OUT") {
        router.push("/auth/login");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAuthAndRole, fetchProperties, supabase.auth, router]);

  // Filter properties when search term or properties change
  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm]);

  // Function to manually refresh properties
  const refreshProperties = async () => {
    try {
      setLoading(true);
      const user = await checkAuthAndRole();
      if (user) {
        await fetchProperties(user.id);
        toast({
          title: "Properties refreshed",
          description: "The property list has been updated.",
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  const togglePropertyStatus = async (
    propertyId: string,
    currentStatus: boolean
  ) => {
    try {
      const { error } = await supabase
        .from("farmhouses")
        .update({ is_active: !currentStatus })
        .eq("id", propertyId);

      if (error) throw error;

      // Update local state
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, is_active: !currentStatus } : p
        )
      );

      toast({
        title: `Property ${
          !currentStatus ? "activated" : "deactivated"
        } successfully`,
        description: `The property has been ${
          !currentStatus ? "activated" : "deactivated"
        }.`,
      });
    } catch (error) {
      console.error("Error updating property status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update property status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("farmhouses")
        .delete()
        .eq("id", propertyId);

      if (error) throw error;

      // Update local state
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      toast({
        title: "Property deleted successfully",
        description: "The property has been removed from your listings.",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete property.",
      });
    }
  };

  // Show loading only if auth hasn't been checked yet or if we're still loading data
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar currentPage="properties" siteName="FarmStay Oasis" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600">Manage your farmstay listings</p>
          </div>
          <Link href="/dashboard/properties/new">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Search and Refresh */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={refreshProperties}
            variant="outline"
            size="icon"
            title="Refresh properties"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Get started by adding your first property"}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/properties/new">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Property
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={
                      property.images[0] ||
                      `/placeholder.svg?height=200&width=400&query=farmhouse property ${
                        property.name || "/placeholder.svg"
                      }`
                    }
                    alt={property.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={
                        property.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {property.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {property.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {property.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{property.max_guests} guests</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${property.price_per_night}/night</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/properties/${getPropertySlug({id: property.id, name: property.name})}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/properties/${property.id}/edit`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        togglePropertyStatus(property.id, property.is_active)
                      }
                      className={
                        property.is_active
                          ? "text-red-600 hover:text-red-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      {property.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProperty(property.id)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Property
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
