"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SimpleCalendar } from "@/components/ui/simple-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Utensils,
  CalendarIcon,
  ArrowLeft,
  Share,
  Shield,
  Award,
  CheckCircle,
  Camera,
  Clock,
  TreePine,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPropertySlug } from "@/lib/utils/slug";
import { getRandomReviews } from "@/lib/data/reviews";

interface Farmhouse {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  is_active: boolean;
  owner_id: string;
  average_rating?: number;
  total_reviews?: number;
}

interface BookingForm {
  check_in_date: Date | undefined;
  check_out_date: Date | undefined;
  guests: number | string;
  special_requests: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Farmhouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [reviews, setReviews] = useState(getRandomReviews(2));
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    check_in_date: undefined,
    check_out_date: undefined,
    guests: 2,
    special_requests: "",
  });
  const { toast } = useToast();
  const [isBooking, setIsBooking] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (params.slug) {
      fetchPropertyBySlug(params.slug as string);
      fetchSiteSettings();

      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10 seconds timeout

      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, [params.slug]);

  const fetchSiteSettings = async () => {
    try {
      const supabase = createClient();
      const { data: settings } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("key", "site_name")
        .single();

      if (settings?.value) {
        setSiteName(settings.value);
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  };

  const fetchPropertyBySlug = async (slug: string) => {
    try {
      const supabase = createClient();
      console.log("Looking for property with slug:", slug);

      // Get all properties (both active and inactive for debugging)
      const { data, error } = await supabase.from("farmhouses").select("*");

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Total properties in database:", data?.length || 0);
      console.log(
        "Active properties:",
        data?.filter((p: any) => p.is_active)?.length || 0
      );

      if (!data || data.length === 0) {
        console.log("No properties found in database");
        setProperty(null);
        return;
      }

      // Find property by exact slug match (only active properties)
      const activeProperties = data.filter((p: any) => p.is_active);
      const matchedProperty = activeProperties.find((p: any) => {
        const propertySlug = getPropertySlug(p);
        console.log(
          `Property "${p.name}" -> slug: "${propertySlug}" (looking for: "${slug}")`
        );
        return propertySlug === slug;
      });

      console.log("Matched property:", matchedProperty?.name || "None found");

      if (matchedProperty) {
        const propertyWithRating = {
          ...matchedProperty,
          average_rating: matchedProperty.rating || 0,
          total_reviews: matchedProperty.total_reviews || 0,
        };
        console.log("Setting property:", propertyWithRating.name);
        setProperty(propertyWithRating);
      } else {
        console.log("No matching property found for slug:", slug);
        // List all available slugs for debugging
        console.log(
          "Available slugs:",
          activeProperties.map((p: any) => getPropertySlug(p))
        );

        // Try partial matching as fallback
        const partialMatch = activeProperties.find((p: any) => {
          const propertySlug = getPropertySlug(p);
          return propertySlug.includes(slug) || slug.includes(propertySlug);
        });

        if (partialMatch) {
          console.log("Found partial match:", partialMatch.name);
          const propertyWithRating = {
            ...partialMatch,
            average_rating: partialMatch.rating || 0,
            total_reviews: partialMatch.total_reviews || 0,
          };
          setProperty(propertyWithRating);
        } else {
          setProperty(null);
        }
      }
    } catch (error) {
      console.error("Error fetching property by slug:", error);
      setProperty(null);
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (
      !bookingForm.check_in_date ||
      !bookingForm.check_out_date ||
      !property
    ) {
      return 0;
    }
    const nights = Math.ceil(
      (bookingForm.check_out_date.getTime() -
        bookingForm.check_in_date.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return nights * property.price_per_night;
  };

  const handleBooking = async () => {
    // Check if user is logged in first
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Login Required",
        description:
          "You need to login to book a farm house. Please sign in to continue.",
        variant: "destructive",
      });
      // Redirect to login page
      window.location.href = "/auth/login";
      return;
    }

    // Validate form fields
    if (
      !property ||
      !bookingForm.check_in_date ||
      !bookingForm.check_out_date
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all required fields including check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }

    // Validate guest count
    const guestCount =
      typeof bookingForm.guests === "string"
        ? parseInt(bookingForm.guests)
        : bookingForm.guests;

    if (!guestCount || isNaN(guestCount) || guestCount < 1) {
      toast({
        title: "Invalid Guest Count",
        description: "Please enter a valid number of guests (minimum 1).",
        variant: "destructive",
      });
      return;
    }

    if (guestCount > property.max_guests) {
      toast({
        title: "Too Many Guests",
        description: `This property can accommodate maximum ${property.max_guests} guests.`,
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    if (bookingForm.check_out_date <= bookingForm.check_in_date) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const totalAmount = calculateTotalPrice();

      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        farmhouse_id: property.id,
        check_in: format(bookingForm.check_in_date, "yyyy-MM-dd"),
        check_out: format(bookingForm.check_out_date, "yyyy-MM-dd"),
        guests: guestCount,
        total_amount: totalAmount,
        special_requests: bookingForm.special_requests || null,
        status: "pending",
      });

      if (error) throw error;

      // Clear form after successful booking
      setBookingForm({
        check_in_date: undefined,
        check_out_date: undefined,
        guests: 2,
        special_requests: "",
      });

      // Show success message
      toast({
        title: "🎉 Farm House Booked Successfully!",
        description: `Your booking for ${property.name} has been confirmed. You'll receive a confirmation email shortly with all the details.`,
        duration: 6000,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: any } = {
      wifi: Wifi,
      parking: Car,
      breakfast: Coffee,
      kitchen: Utensils,
      verified: Shield,
      award: Award,
      pool: "🏊",
      garden: TreePine,
      fireplace: "🔥",
      bbq: "🍖",
    };
    const IconComponent = icons[amenity.toLowerCase()];
    if (typeof IconComponent === "string") {
      return <span className="text-lg">{IconComponent}</span>;
    }
    return IconComponent ? (
      <IconComponent className="w-5 h-5" />
    ) : (
      <CheckCircle className="w-5 h-5" />
    );
  };

  const propertyImages = property?.images?.length
    ? property.images
    : [
        `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        `https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        `https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        `https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        `https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
      ];

  if (loading) {
    return (
      <>
        <title>Loading Property - {siteName}</title>
        <div className="min-h-screen bg-gray-50">
          <Navbar currentPage="properties" />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600">Loading property details...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <title>Property Not Found - {siteName}</title>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center space-y-6 p-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-900">
                Oops! Property Not Found
              </h2>
              <p className="text-gray-600 leading-relaxed">
                The farm house you're looking for doesn't exist or may have been
                removed. Don't worry, we have many other amazing farm houses
                waiting for you!
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/properties">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                  Browse All Properties
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full py-3 text-lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <title>
        {property.name} - {siteName}
      </title>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="properties" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Link
            href="/properties"
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Back to Properties</span>
          </Link>

          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-2">
                  {property.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(property.average_rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm sm:text-base">
                      {property.average_rating
                        ? property.average_rating.toFixed(1)
                        : "0.0"}
                    </span>
                    <span className="text-sm sm:text-base">
                      ({property.total_reviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm sm:text-base">
                      {property.location}
                    </span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 w-fit">
                    Verified Property
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer text-xs sm:text-sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: property.name,
                        text: `Check out this amazing farm house: ${property.name}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link Copied!",
                        description:
                          "Property link has been copied to clipboard.",
                      });
                    }
                  }}
                >
                  <Share className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden">
                  <Image
                    src={
                      propertyImages[selectedImageIndex] || "/placeholder.svg"
                    }
                    alt={`${property.name} - Image ${selectedImageIndex + 1}`}
                    width={800}
                    height={500}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {selectedImageIndex + 1} / {propertyImages.length}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm text-xs sm:text-sm"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">View All Photos</span>
                    <span className="sm:hidden">Photos</span>
                  </Button>
                </div>

                <div className="grid grid-cols-5 gap-1 sm:gap-2">
                  {propertyImages.slice(0, 5).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative rounded-md sm:rounded-lg overflow-hidden ${
                        selectedImageIndex === index
                          ? "ring-2 ring-green-500"
                          : ""
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${property.name} thumbnail ${index + 1}`}
                        width={150}
                        height={100}
                        className="w-full h-12 sm:h-16 lg:h-20 object-cover hover:opacity-80 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About this farm house
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {property.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    Property Features
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">
                          {property.max_guests}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Guests
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <Bed className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">
                          {property.bedrooms}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Bedrooms
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-purple-50 rounded-lg">
                      <Bath className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">
                          {property.bathrooms}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Bathrooms
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-amber-50 rounded-lg">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">
                          Verified
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Property
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    What this place offers
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-green-600 flex-shrink-0">
                          {getAmenityIcon(amenity)}
                        </div>
                        <span className="text-gray-700 capitalize font-medium">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 sm:pt-6">
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current inline mr-2" />
                      {(property.average_rating || 0).toFixed(1)} ·{" "}
                      {property.total_reviews || 0} reviews
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {reviews.map((review, index) => (
                      <Card key={index} className="border-0 shadow-sm">
                        <CardContent className="p-3 sm:p-4">
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900 text-sm sm:text-base">
                                {review.name}
                              </h5>
                              <span className="text-xs text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-yellow-400 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                            {review.text}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Where you'll be
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-gray-900">
                          {property.location}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{property.address}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>30 minutes from city center</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TreePine className="w-4 h-4 text-gray-500" />
                          <span>Surrounded by nature</span>
                        </div>
                      </div>
                      <div className="w-full h-64 rounded-lg overflow-hidden">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.74844097932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Property Location Map"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-24 shadow-xl border-0">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        ₹{property.price_per_night.toLocaleString()}
                      </span>
                      <span className="text-base sm:text-lg text-gray-600 ml-2">
                        per night
                      </span>
                    </div>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-sm sm:text-base">
                      {(property.average_rating || 0).toFixed(1)}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      ({property.total_reviews || 0} reviews)
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                        Check-in Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal h-10 sm:h-12 px-3 sm:px-4 border-2 hover:border-green-300 focus:border-green-500 transition-colors ${
                              bookingForm.check_in_date
                                ? "text-gray-900 border-green-200"
                                : "text-gray-500 border-gray-200"
                            }`}
                          >
                            <CalendarIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            <span className="text-sm sm:text-base">
                              {bookingForm.check_in_date
                                ? format(
                                    bookingForm.check_in_date,
                                    "MMM dd, yyyy"
                                  )
                                : "Select check-in date"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white border shadow-lg z-[9999]"
                          align="start"
                          sideOffset={8}
                        >
                          <SimpleCalendar
                            selected={bookingForm.check_in_date}
                            onSelect={(date) => {
                              setBookingForm((prev) => ({
                                ...prev,
                                check_in_date: date,
                              }));
                            }}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                        Check-out Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal h-10 sm:h-12 px-3 sm:px-4 border-2 hover:border-green-300 focus:border-green-500 transition-colors ${
                              bookingForm.check_out_date
                                ? "text-gray-900 border-green-200"
                                : "text-gray-500 border-gray-200"
                            }`}
                          >
                            <CalendarIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            <span className="text-sm sm:text-base">
                              {bookingForm.check_out_date
                                ? format(
                                    bookingForm.check_out_date,
                                    "MMM dd, yyyy"
                                  )
                                : "Select check-out date"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white border shadow-lg z-[9999]"
                          align="start"
                          sideOffset={8}
                        >
                          <SimpleCalendar
                            selected={bookingForm.check_out_date}
                            onSelect={(date) => {
                              setBookingForm((prev) => ({
                                ...prev,
                                check_out_date: date,
                              }));
                            }}
                            disabled={(date) => {
                              if (date < new Date()) return true;
                              if (
                                bookingForm.check_in_date &&
                                date <= bookingForm.check_in_date
                              )
                                return true;
                              return false;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                        Number of Guests
                      </Label>
                      <Input
                        type="number"
                        max={property.max_guests}
                        value={bookingForm.guests || ""}
                        onChange={(e) => {
                          const inputValue = e.target.value;

                          // Allow empty input for user to completely clear and retype
                          if (inputValue === "") {
                            setBookingForm((prev) => ({
                              ...prev,
                              guests: "" as any,
                            }));
                            return;
                          }

                          let value = parseInt(inputValue);
                          const maxGuests = property.max_guests;

                          // Only update if it's a valid number
                          if (!isNaN(value)) {
                            // Automatically cap the value to max guests
                            if (value > maxGuests) {
                              value = maxGuests;
                            }

                            setBookingForm((prev) => ({
                              ...prev,
                              guests: value,
                            }));
                          }
                        }}
                        placeholder="Enter number of guests"
                        className="h-10 sm:h-12 border-2 hover:border-green-300 focus:border-green-500 transition-colors text-sm sm:text-base"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum {property.max_guests} guests allowed
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        placeholder="Any special requirements or requests..."
                        value={bookingForm.special_requests}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            special_requests: e.target.value,
                          }))
                        }
                        className="border-2 hover:border-green-300 focus:border-green-500 transition-colors text-sm sm:text-base"
                        rows={3}
                      />
                    </div>

                    {calculateTotalPrice() > 0 && (
                      <div className="bg-green-50 p-3 sm:p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>
                            ₹{property.price_per_night.toLocaleString()} x{" "}
                            {Math.ceil(
                              (bookingForm.check_out_date!.getTime() -
                                bookingForm.check_in_date!.getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            nights
                          </span>
                          <span>₹{calculateTotalPrice().toLocaleString()}</span>
                        </div>
                        <div className="border-t border-green-200 pt-2 flex justify-between font-semibold text-sm sm:text-base">
                          <span>Total</span>
                          <span>₹{calculateTotalPrice().toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleBooking}
                      disabled={isBooking}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg transition-all duration-200 hover:shadow-lg"
                    >
                      {isBooking ? "Processing..." : "Reserve Now"}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      You won't be charged yet. We'll confirm your booking
                      first.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
