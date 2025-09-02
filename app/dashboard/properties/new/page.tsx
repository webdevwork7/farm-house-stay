"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Plus,
  X,
  Home,
  MapPin,
  Users,
  Bed,
  Bath,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";

interface PropertyForm {
  name: string;
  description: string;
  location: string;
  price_per_night: string;
  max_guests: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  images: string[];
}

export default function NewPropertyPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [newAmenity, setNewAmenity] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const [formData, setFormData] = useState<PropertyForm>({
    name: "",
    description: "",
    location: "",
    price_per_night: "",
    max_guests: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    images: [],
  });

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchSettings();
  }, []);

  const checkAuthAndFetchSettings = async () => {
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

      if (error || !userData || userData.role !== "owner") {
        toast({
          title: "Access Denied",
          description: "You need to be a property owner to add properties.",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      setUser({ id: user.id, email: user.email || "" });

      const { data: settings } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("key", "site_name")
        .single();

      if (settings?.value) {
        setSiteName(settings.value);
      }
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAmenity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newAmenity.trim()) {
      e.preventDefault();
      const amenity = newAmenity.trim();

      if (!formData.amenities.includes(amenity)) {
        setFormData((prev) => ({
          ...prev,
          amenities: [...prev.amenities, amenity],
        }));
      }

      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter(
        (amenity) => amenity !== amenityToRemove
      ),
    }));
  };

  const handleAddImage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newImageUrl.trim()) {
      e.preventDefault();
      addImageToList();
    }
  };

  const addImageToList = () => {
    const imageUrl = newImageUrl.trim();
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      setNewImageUrl("");
    }
  };

  const removeImage = (imageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image !== imageToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a property.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.location ||
      !formData.price_per_night ||
      !formData.max_guests ||
      !formData.bedrooms ||
      !formData.bathrooms
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: "Images Required",
        description: "Please add at least one image for your property.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();

      const propertyData = {
        owner_id: user.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        price_per_night: parseFloat(formData.price_per_night),
        max_guests: parseInt(formData.max_guests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        amenities: formData.amenities,
        images: formData.images,
        is_active: true,
        rating: 0,
        total_reviews: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("farmhouses")
        .insert(propertyData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "🎉 Property Added Successfully!",
        description: `${formData.name} has been added and is now live on the platform.`,
        duration: 6000,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        location: "",
        price_per_night: "",
        max_guests: "",
        bedrooms: "",
        bathrooms: "",
        amenities: [],
        images: [],
      });

      // Redirect to properties list
      router.push("/dashboard/properties");
    } catch (error) {
      toast({
        title: "Failed to Add Property",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Add New Property - {siteName}</title>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar currentPage="properties" siteName={siteName} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link
              href="/dashboard/properties"
              className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Properties</span>
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Add New Property
            </h1>
            <p className="text-gray-600">
              Create a new farm house listing for guests to discover and book.
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-green-600" />
                <span>Property Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Property Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Serene Valley Farmhouse"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g., Shamirpet, Hyderabad"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your property, its unique features, and what makes it special..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Property Details
                  </h3>

                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price_per_night">
                        Price per Night (₹) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="price_per_night"
                          name="price_per_night"
                          type="number"
                          value={formData.price_per_night}
                          onChange={handleInputChange}
                          placeholder="8500"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_guests">Max Guests *</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="max_guests"
                          name="max_guests"
                          type="number"
                          value={formData.max_guests}
                          onChange={handleInputChange}
                          placeholder="8"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms *</Label>
                      <div className="relative">
                        <Bed className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="bedrooms"
                          name="bedrooms"
                          type="number"
                          value={formData.bedrooms}
                          onChange={handleInputChange}
                          placeholder="3"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms *</Label>
                      <div className="relative">
                        <Bath className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="bathrooms"
                          name="bathrooms"
                          type="number"
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                          placeholder="2"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Amenities
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amenity-input">Add Amenities</Label>
                      <Input
                        id="amenity-input"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        onKeyDown={handleAddAmenity}
                        placeholder="Type amenity name and press Enter (e.g., WiFi, Swimming Pool, Garden)"
                      />
                      <p className="text-sm text-gray-500">
                        Press Enter to add each amenity. You can add multiple
                        amenities.
                      </p>
                    </div>

                    {formData.amenities.length > 0 && (
                      <div className="space-y-2">
                        <Label>Added Amenities</Label>
                        <div className="flex flex-wrap gap-2">
                          {formData.amenities.map((amenity, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1"
                            >
                              {amenity}
                              <button
                                type="button"
                                onClick={() => removeAmenity(amenity)}
                                className="ml-2 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Property Images *
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-input">Add Image URLs</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="image-input"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          onKeyDown={handleAddImage}
                          placeholder="Paste image URL and press Enter or click Add"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addImageToList}
                          variant="outline"
                          className="cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Press Enter or click the + button to add each image URL.
                        You can add unlimited images.
                      </p>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="space-y-2">
                        <Label>Added Images ({formData.images.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Property image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.svg";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(image)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Link href="/dashboard/properties">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Property...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Property
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
