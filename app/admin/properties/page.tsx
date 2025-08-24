"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Home,
  Eye,
  Check,
  X,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminNavbar from "@/components/AdminNavbar";

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
  users?: {
    full_name: string;
    email: string;
  };
}

const AMENITIES_OPTIONS = [
  "WiFi",
  "Swimming Pool",
  "Garden",
  "BBQ Area",
  "Parking",
  "Kitchen",
  "Air Conditioning",
  "Spa",
  "Farm Activities",
  "Bonfire",
  "Pet Friendly",
  "Gym",
  "Library",
  "Game Room",
  "Outdoor Dining",
];

// Custom DialogContent with transparent overlay
function CustomDialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={`bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border shadow-lg duration-200 p-6 ${className}`}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    location: "",
    price_per_night: "",
    max_guests: "",
    bedrooms: "",
    bathrooms: "",
    rating: "",
    total_reviews: "",
    amenities: [] as string[],
    images: [] as string[],
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    location: "",
    price_per_night: "",
    max_guests: "",
    bedrooms: "",
    bathrooms: "",
    rating: "",
    total_reviews: "",
    amenities: [] as string[],
    images: [] as string[],
  });
  const [addImageUrl, setAddImageUrl] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchProperties();
  }, []);

  const checkAuthAndFetchProperties = async () => {
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

      // Allow access if user is admin in database OR if email is admin@gmail.com
      const isAdmin =
        (userData && userData.role === "admin") ||
        user.email === "admin@gmail.com";

      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      // Fetch all properties with owner information
      const { data: propertiesData } = await supabase
        .from("farmhouses")
        .select(
          `
          *,
          users!farmhouses_owner_id_fkey (
            full_name,
            email
          )
        `
        )
        .order("created_at", { ascending: false });

      setProperties(propertiesData || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePropertyStatus = async (
    propertyId: string,
    isActive: boolean
  ) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("farmhouses")
        .update({ is_active: isActive })
        .eq("id", propertyId);

      if (error) throw error;

      // Update local state
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, is_active: isActive } : p
        )
      );

      toast({
        title: "Property Status Updated",
        description: `Property ${
          isActive ? "approved" : "rejected"
        } successfully.`,
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
        "Are you sure you want to deactivate this property? It will no longer be visible to users."
      )
    ) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("farmhouses")
        .update({ is_active: false })
        .eq("id", propertyId);

      if (error) throw error;

      // Update local state
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, is_active: false } : p))
      );

      toast({
        title: "Property Deactivated",
        description: "Property has been deactivated successfully.",
      });
    } catch (error) {
      console.error("Error deactivating property:", error);
      toast({
        title: "Deactivation Failed",
        description: "Failed to deactivate property. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (property: Property) => {
    setEditingProperty(property);
    setEditForm({
      name: property.name,
      description: property.description,
      location: property.location,
      price_per_night: property.price_per_night.toString(),
      max_guests: property.max_guests.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      rating: (property as any).rating?.toString() || "0",
      total_reviews: (property as any).total_reviews?.toString() || "0",
      amenities: property.amenities || [],
      images: property.images || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    setEditLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("farmhouses")
        .update({
          name: editForm.name,
          description: editForm.description,
          location: editForm.location,
          price_per_night: parseFloat(editForm.price_per_night),
          max_guests: parseInt(editForm.max_guests),
          bedrooms: parseInt(editForm.bedrooms),
          bathrooms: parseInt(editForm.bathrooms),
          rating: parseFloat(editForm.rating) || 0,
          total_reviews: parseInt(editForm.total_reviews) || 0,
          amenities: editForm.amenities,
          images: editForm.images,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingProperty.id);

      if (error) throw error;

      // Update local state
      setProperties((prev) =>
        prev.map((p) =>
          p.id === editingProperty.id
            ? {
                ...p,
                name: editForm.name,
                description: editForm.description,
                location: editForm.location,
                price_per_night: parseFloat(editForm.price_per_night),
                max_guests: parseInt(editForm.max_guests),
                bedrooms: parseInt(editForm.bedrooms),
                bathrooms: parseInt(editForm.bathrooms),
                rating: parseFloat(editForm.rating) || 0,
                total_reviews: parseInt(editForm.total_reviews) || 0,
                amenities: editForm.amenities,
                images: editForm.images,
              }
            : p
        )
      );

      toast({
        title: "Property Updated",
        description: "Property has been updated successfully.",
      });

      setEditingProperty(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating property:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setEditForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addEditImageUrl = () => {
    if (newImageUrl.trim()) {
      setEditForm((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const removeEditImage = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddAmenityToggle = (amenity: string) => {
    setAddForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addNewImageUrl = () => {
    if (addImageUrl.trim()) {
      setAddForm((prev) => ({
        ...prev,
        images: [...prev.images, addImageUrl.trim()],
      }));
      setAddImageUrl("");
    }
  };

  const removeNewImage = (index: number) => {
    setAddForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add a property.",
          variant: "destructive",
        });
        setAddLoading(false);
        return;
      }

      // Validate required fields
      if (
        !addForm.name ||
        !addForm.description ||
        !addForm.location ||
        !addForm.price_per_night ||
        !addForm.max_guests ||
        !addForm.bedrooms ||
        !addForm.bathrooms
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setAddLoading(false);
        return;
      }

      if (addForm.images.length === 0) {
        toast({
          title: "Images Required",
          description: "Please add at least one image for the property.",
          variant: "destructive",
        });
        setAddLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("farmhouses")
        .insert({
          owner_id: user.id,
          name: addForm.name,
          description: addForm.description,
          location: addForm.location,
          price_per_night: parseFloat(addForm.price_per_night),
          max_guests: parseInt(addForm.max_guests),
          bedrooms: parseInt(addForm.bedrooms),
          bathrooms: parseInt(addForm.bathrooms),
          amenities: addForm.amenities,
          images: addForm.images,
          is_active: true,
          rating: parseFloat(addForm.rating) || 0,
          total_reviews: parseInt(addForm.total_reviews) || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select(
          `
          *,
          users!farmhouses_owner_id_fkey (
            full_name,
            email
          )
        `
        );

      if (error) throw error;

      // Add to local state
      if (data && data[0]) {
        setProperties((prev) => [data[0], ...prev]);
      }

      toast({
        title: "🎉 Property Added Successfully!",
        description: `${addForm.name} has been added and is now live.`,
        duration: 5000,
      });

      // Reset form and close dialog
      setAddForm({
        name: "",
        description: "",
        location: "",
        price_per_night: "",
        max_guests: "",
        bedrooms: "",
        bathrooms: "",
        rating: "",
        total_reviews: "",
        amenities: [],
        images: [],
      });
      setAddImageUrl("");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Failed to Add Property",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar currentPage="properties" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Property Management
            </h1>
            <p className="text-gray-600">
              Review and manage all property listings
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                Add New Property
              </Button>
            </DialogTrigger>
            <CustomDialogContent className="w-[80vw] max-w-none h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProperty} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-name">Property Name</Label>
                    <Input
                      id="add-name"
                      value={addForm.name}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g., Serene Valley Farmhouse"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-location">Location</Label>
                    <Input
                      id="add-location"
                      value={addForm.location}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="e.g., Shamirpet, Hyderabad"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-description">Description</Label>
                  <Textarea
                    id="add-description"
                    value={addForm.description}
                    onChange={(e) =>
                      setAddForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the property..."
                    rows={3}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-price">Price per Night</Label>
                    <Input
                      id="add-price"
                      type="number"
                      value={addForm.price_per_night}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          price_per_night: e.target.value,
                        }))
                      }
                      placeholder="8500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-guests">Max Guests</Label>
                    <Input
                      id="add-guests"
                      type="number"
                      value={addForm.max_guests}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          max_guests: e.target.value,
                        }))
                      }
                      placeholder="8"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-bedrooms">Bedrooms</Label>
                    <Input
                      id="add-bedrooms"
                      type="number"
                      value={addForm.bedrooms}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          bedrooms: e.target.value,
                        }))
                      }
                      placeholder="3"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-bathrooms">Bathrooms</Label>
                    <Input
                      id="add-bathrooms"
                      type="number"
                      value={addForm.bathrooms}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          bathrooms: e.target.value,
                        }))
                      }
                      placeholder="2"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-rating">Rating (0-5)</Label>
                    <Input
                      id="add-rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={addForm.rating}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          rating: e.target.value,
                        }))
                      }
                      placeholder="4.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-total-reviews">Total Reviews</Label>
                    <Input
                      id="add-total-reviews"
                      type="number"
                      min="0"
                      value={addForm.total_reviews}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          total_reviews: e.target.value,
                        }))
                      }
                      placeholder="25"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`add-${amenity}`}
                          checked={addForm.amenities.includes(amenity)}
                          onCheckedChange={() =>
                            handleAddAmenityToggle(amenity)
                          }
                        />
                        <Label htmlFor={`add-${amenity}`} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Images</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={addImageUrl}
                      onChange={(e) => setAddImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addNewImageUrl}
                      variant="outline"
                      className="cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {addForm.images.length > 0 && (
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {addForm.images.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <span className="flex-1 truncate">{url}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => removeNewImage(index)}
                            className="cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addLoading}
                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                  >
                    {addLoading ? "Creating..." : "Create Property"}
                  </Button>
                </div>
              </form>
            </CustomDialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.name}
                        width={120}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-30 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Home className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {property.name}
                          </h3>
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

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{property.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{property.max_guests} guests</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>₹{property.price_per_night}/night</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600">
                          Owner: {property.users?.full_name || "Unknown"} (
                          {property.users?.email || "No email"})
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Dialog
                          open={isEditDialogOpen}
                          onOpenChange={setIsEditDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(property)}
                              className="text-blue-600 hover:text-blue-700 cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <CustomDialogContent className="w-[80vw] max-w-none h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Property</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={handleEditSubmit}
                              className="space-y-6"
                            >
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Property Name</Label>
                                  <Input
                                    id="name"
                                    value={editForm.name}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                      }))
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="location">Location</Label>
                                  <Input
                                    id="location"
                                    value={editForm.location}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        location: e.target.value,
                                      }))
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                  id="description"
                                  value={editForm.description}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({
                                      ...prev,
                                      description: e.target.value,
                                    }))
                                  }
                                  rows={3}
                                  required
                                />
                              </div>
                              <div className="grid md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="price">Price per Night</Label>
                                  <Input
                                    id="price"
                                    type="number"
                                    value={editForm.price_per_night}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        price_per_night: e.target.value,
                                      }))
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="guests">Max Guests</Label>
                                  <Input
                                    id="guests"
                                    type="number"
                                    value={editForm.max_guests}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        max_guests: e.target.value,
                                      }))
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="bedrooms">Bedrooms</Label>
                                  <Input
                                    id="bedrooms"
                                    type="number"
                                    value={editForm.bedrooms}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        bedrooms: e.target.value,
                                      }))
                                    }
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="bathrooms">Bathrooms</Label>
                                  <Input
                                    id="bathrooms"
                                    type="number"
                                    value={editForm.bathrooms}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        bathrooms: e.target.value,
                                      }))
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="rating">Rating (0-5)</Label>
                                  <Input
                                    id="rating"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={editForm.rating}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        rating: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="total-reviews">
                                    Total Reviews
                                  </Label>
                                  <Input
                                    id="total-reviews"
                                    type="number"
                                    min="0"
                                    value={editForm.total_reviews}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        total_reviews: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Amenities</Label>
                                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                                  {AMENITIES_OPTIONS.map((amenity) => (
                                    <div
                                      key={amenity}
                                      className="flex items-center space-x-2"
                                    >
                                      <Checkbox
                                        id={`edit-${amenity}`}
                                        checked={editForm.amenities.includes(
                                          amenity
                                        )}
                                        onCheckedChange={() =>
                                          handleAmenityToggle(amenity)
                                        }
                                      />
                                      <Label
                                        htmlFor={`edit-${amenity}`}
                                        className="text-sm"
                                      >
                                        {amenity}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Images</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    value={newImageUrl}
                                    onChange={(e) =>
                                      setNewImageUrl(e.target.value)
                                    }
                                    placeholder="Enter image URL"
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    onClick={addEditImageUrl}
                                    variant="outline"
                                    className="cursor-pointer"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                {editForm.images.length > 0 && (
                                  <div className="space-y-1 max-h-24 overflow-y-auto">
                                    {editForm.images.map((url, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center space-x-2 text-sm"
                                      >
                                        <span className="flex-1 truncate">
                                          {url}
                                        </span>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => removeEditImage(index)}
                                          className="cursor-pointer"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsEditDialogOpen(false)}
                                  className="cursor-pointer"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={editLoading}
                                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                >
                                  {editLoading
                                    ? "Updating..."
                                    : "Update Property"}
                                </Button>
                              </div>
                            </form>
                          </CustomDialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updatePropertyStatus(
                              property.id,
                              !property.is_active
                            )
                          }
                          className={
                            property.is_active
                              ? "text-red-600 hover:text-red-700 cursor-pointer"
                              : "text-green-600 hover:text-green-700 cursor-pointer"
                          }
                        >
                          {property.is_active ? (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Link href={`/properties/${property.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProperty(property.id)}
                          className="text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          Deactivate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
