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
import { useRouter, useParams } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [newAmenity, setNewAmenity] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    checkAuthAndFetchProperty();
  }, [propertyId]);

  const checkAuthAndFetchProperty = async () => {
    try {
      setLoading(true);
      
      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check user role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userError || !userData || userData.role !== "owner") {
        toast({
          title: "Access Denied",
          description: "You need to be a property owner to edit properties.",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      setUser({ id: user.id, email: user.email || "" });

      // Fetch site settings
      const { data: settings } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("key", "site_name")
        .single();

      if (settings?.value) {
        setSiteName(settings.value);
      }

      // Fetch property data
      const { data: property, error: propertyError } = await supabase
        .from("farmhouses")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (propertyError || !property) {
        toast({
          title: "Property Not Found",
          description: "The property you're trying to edit could not be found.",
          variant: "destructive",
        });
        router.push("/dashboard/properties");
        return;
      }

      // Check if user is the owner of this property
      if (property.owner_id !== user.id) {
        toast({
          title: "Access Denied",
          description: "You can only edit your own properties.",
          variant: "destructive",
        });
        router.push("/dashboard/properties");
        return;
      }

      // Populate form with property data
      setName(property.name);
      setDescription(property.description || "");
      setLocation(property.location);
      setPricePerNight(property.price_per_night.toString());
      setMaxGuests(property.max_guests.toString());
      setBedrooms(property.bedrooms.toString());
      setBathrooms(property.bathrooms.toString());
      setAmenities(property.amenities || []);
      setImages(property.images || []);
    } catch (error) {
      console.error("Error fetching property:", error);
      toast({
        title: "Error",
        description: "Failed to load property data. Please try again.",
        variant: "destructive",
      });
      router.push("/dashboard/properties");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAmenity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newAmenity.trim()) {
      e.preventDefault();
      const amenity = newAmenity.trim();
      if (!amenities.includes(amenity)) {
        setAmenities((prev) => [...prev, amenity]);
      }
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    setAmenities((prev) =>
      prev.filter((amenity) => amenity !== amenityToRemove)
    );
  };

  const handleAddImage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newImageUrl.trim()) {
      e.preventDefault();
      addImageToList();
    }
  };

  const addImageToList = () => {
    const imageUrl = newImageUrl.trim();
    if (imageUrl && !images.includes(imageUrl)) {
      setImages((prev) => [...prev, imageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImage = (imageToRemove: string) => {
    setImages((prev) => prev.filter((image) => image !== imageToRemove));
  };

  const updateProperty = async () => {
    if (!name || !location) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and location.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("farmhouses")
        .update({
          name: name.trim(),
          description: description.trim() || "No description provided",
          location: location.trim(),
          price_per_night: parseInt(pricePerNight) || 1000,
          max_guests: parseInt(maxGuests) || 2,
          bedrooms: parseInt(bedrooms) || 1,
          bathrooms: parseInt(bathrooms) || 1,
          amenities: amenities,
          images:
            images.length > 0
              ? images
              : ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"],
          updated_at: new Date().toISOString(),
        })
        .eq("id", propertyId);

      if (error) throw error;

      toast({
        title: "Property Updated Successfully!",
        description: `${name} has been updated successfully.`,
        duration: 6000,
      });

      // Redirect with cache-busting parameter
      router.replace(`/dashboard/properties?t=${Date.now()}`);
    } catch (error) {
      console.error("Property update error:", error);

      toast({
        title: "Error Updating Property",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Edit Property - {siteName}</title>
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
              Edit Property
            </h1>
            <p className="text-gray-600">
              Update your farm house listing details.
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
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Property Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Serene Valley Farmhouse"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g., Shamirpet, Hyderabad"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your property, its unique features, and what makes it special..."
                      rows={4}
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
                          type="number"
                          value={pricePerNight}
                          onChange={(e) => setPricePerNight(e.target.value)}
                          placeholder="8500"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_guests">Max Guests *</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="max_guests"
                          type="number"
                          value={maxGuests}
                          onChange={(e) => setMaxGuests(e.target.value)}
                          placeholder="8"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms *</Label>
                      <div className="relative">
                        <Bed className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="bedrooms"
                          type="number"
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          placeholder="3"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms *</Label>
                      <div className="relative">
                        <Bath className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="bathrooms"
                          type="number"
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          placeholder="2"
                          className="pl-10"
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

                    {amenities.length > 0 && (
                      <div className="space-y-2">
                        <Label>Added Amenities</Label>
                        <div className="flex flex-wrap gap-2">
                          {amenities.map((amenity, index) => (
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
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Press Enter or click the + button to add each image URL.
                        You can add unlimited images.
                      </p>
                    </div>

                    {images.length > 0 && (
                      <div className="space-y-2">
                        <Label>Added Images ({images.length})</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {images.map((image, index) => (
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
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    onClick={updateProperty}
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-8"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Property...
                      </>
                    ) : (
                      <>Save Changes</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}