"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
  Phone,
  CheckCircle,
  Camera,
  Clock,
  TreePine,
  Waves,
  Mountain,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";

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
  guests: number;
  special_requests: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Farmhouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
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
    if (params.id) {
      fetchProperty(params.id as string);
      fetchSiteSettings();
    }
  }, [params.id]);

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

  const fetchProperty = async (id: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("farmhouses")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned - property not found
          setProperty(null);
        } else {
          throw error;
        }
        return;
      }

      // STRICTLY USE DATABASE COLUMNS - rating and total_reviews
      const propertyWithRating = {
        ...data,
        average_rating: data.rating || 0, // STRICTLY use database rating column
        total_reviews: data.total_reviews || 0, // STRICTLY use database total_reviews column
      };

      setProperty(propertyWithRating);
    } catch (error) {
      console.error("Error fetching property:", error);
      setProperty(null);
    } finally {
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

    setIsBooking(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Required",
          description:
            "Please sign in to make a booking. You'll be redirected to the login page.",
          variant: "destructive",
        });
        return;
      }

      const totalAmount = calculateTotalPrice();

      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        farmhouse_id: property.id,
        check_in_date: format(bookingForm.check_in_date, "yyyy-MM-dd"),
        check_out_date: format(bookingForm.check_out_date, "yyyy-MM-dd"),
        guests: bookingForm.guests,
        total_amount: totalAmount,
        special_requests: bookingForm.special_requests,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "🎉 Booking Request Submitted!",
        description: `Your booking for ${property.name} has been submitted successfully. You'll receive a confirmation email shortly.`,
        duration: 5000,
      });

      // Reset form
      setBookingForm({
        check_in_date: undefined,
        check_out_date: undefined,
        guests: 2,
        special_requests: "",
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
      pool: Waves,
      garden: TreePine,
      mountain: Mountain,
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
                The property you're looking for doesn't exist or may have been
                removed. Don't worry, we have many other amazing farmstays
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/properties"
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Properties</span>
          </Link>

          {/* Property Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-2">
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
                    <span className="font-medium">
                      {property.average_rating
                        ? property.average_rating.toFixed(1)
                        : "0.0"}
                    </span>
                    <span>({property.total_reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>{property.location}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Verified Property
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: property.name,
                        text: `Check out this amazing farmstay: ${property.name}`,
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
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Enhanced Image Gallery */}
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={
                      propertyImages[selectedImageIndex] || "/placeholder.svg"
                    }
                    alt={`${property.name} - Image ${selectedImageIndex + 1}`}
                    width={800}
                    height={500}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {propertyImages.length}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    View All Photos
                  </Button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {propertyImages.slice(0, 5).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden ${
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
                        className="w-full h-20 object-cover hover:opacity-80 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About this farmstay
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {property.description}
                  </p>
                </div>

                {/* Enhanced Property Features */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Property Features
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {property.max_guests}
                        </div>
                        <div className="text-sm text-gray-600">Guests</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                      <Bed className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {property.bedrooms}
                        </div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                      <Bath className="w-6 h-6 text-purple-600" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {property.bathrooms}
                        </div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
                      <Shield className="w-6 h-6 text-amber-600" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          Verified
                        </div>
                        <div className="text-sm text-gray-600">Property</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Amenities */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    What this place offers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-green-600">
                          {getAmenityIcon(amenity)}
                        </div>
                        <span className="text-gray-700 capitalize font-medium">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      <Star className="w-5 h-5 text-yellow-400 fill-current inline mr-2" />
                      {(property.average_rating || 0).toFixed(1)} ·{" "}
                      {property.total_reviews || 0} reviews
                    </h3>
                    <Button variant="outline" size="sm">
                      View All Reviews
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        name: "Priya Sharma",
                        date: "2 weeks ago",
                        rating: 5,
                        comment:
                          "Absolutely wonderful experience! The farm is beautiful and the hosts are incredibly welcoming. Our kids loved feeding the animals and we enjoyed the fresh farm breakfast every morning.",
                        avatar:
                          "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                      },
                      {
                        name: "Amit Patel",
                        date: "1 month ago",
                        rating: 5,
                        comment:
                          "Perfect getaway from city life. The property is exactly as described and the location is peaceful. Highly recommend for families looking for an authentic farm experience.",
                        avatar:
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                      },
                    ].map((review, index) => (
                      <Card key={index} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Image
                              src={review.avatar || "/placeholder.svg"}
                              alt={review.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {review.name}
                              </h5>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 text-yellow-400 fill-current"
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {review.comment}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Location */}
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
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>30 minutes from city center</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TreePine className="w-4 h-4 text-gray-500" />
                          <span>Surrounded by nature</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Map */}
                    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-y-2b8s&q=${encodeURIComponent(
                          property.location + ", " + property.address
                        )}`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                        title={`Map showing location of ${property.name}`}
                      />
                      <div className="absolute inset-0 bg-gray-300 flex items-center justify-center rounded-lg">
                        <div className="text-center text-gray-600">
                          <MapPin className="w-12 h-12 mx-auto mb-2" />
                          <p className="font-medium">{property.location}</p>
                          <p className="text-sm">{property.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{property.price_per_night.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-600 ml-2">
                        per night
                      </span>
                    </div>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">
                      {(property.average_rating || 0).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({property.total_reviews || 0} reviews)
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Check-in Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal h-12 px-4 border-2 hover:border-green-300 focus:border-green-500 transition-colors ${
                              bookingForm.check_in_date
                                ? "text-gray-900 border-green-200"
                                : "text-gray-500 border-gray-200"
                            }`}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5 text-green-600" />
                            <span className="text-base">
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
                          className="w-auto p-0 shadow-xl border-0"
                          align="start"
                          sideOffset={8}
                        >
                          <div className="bg-white rounded-lg border shadow-lg">
                            <Calendar
                              mode="single"
                              selected={bookingForm.check_in_date}
                              onSelect={(date) =>
                                setBookingForm((prev) => ({
                                  ...prev,
                                  check_in_date: date,
                                }))
                              }
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3"
                              classNames={{
                                months:
                                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                month: "space-y-4",
                                caption:
                                  "flex justify-center pt-1 relative items-center",
                                caption_label: "text-sm font-medium",
                                nav: "space-x-1 flex items-center",
                                nav_button:
                                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell:
                                  "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-green-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-green-50 rounded-md transition-colors",
                                day_selected:
                                  "bg-green-600 text-white hover:bg-green-700 focus:bg-green-600 focus:text-white",
                                day_today: "bg-gray-100 text-gray-900",
                                day_outside: "text-gray-400 opacity-50",
                                day_disabled: "text-gray-400 opacity-50",
                                day_range_middle:
                                  "aria-selected:bg-green-100 aria-selected:text-green-900",
                                day_hidden: "invisible",
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Check-out Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal h-12 px-4 border-2 hover:border-green-300 focus:border-green-500 transition-colors ${
                              bookingForm.check_out_date
                                ? "text-gray-900 border-green-200"
                                : "text-gray-500 border-gray-200"
                            }`}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5 text-green-600" />
                            <span className="text-base">
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
                          className="w-auto p-0 shadow-xl border-0"
                          align="start"
                          sideOffset={8}
                        >
                          <div className="bg-white rounded-lg border shadow-lg">
                            <Calendar
                              mode="single"
                              selected={bookingForm.check_out_date}
                              onSelect={(date) =>
                                setBookingForm((prev) => ({
                                  ...prev,
                                  check_out_date: date,
                                }))
                              }
                              disabled={(date) =>
                                date <=
                                (bookingForm.check_in_date || new Date())
                              }
                              initialFocus
                              className="p-3"
                              classNames={{
                                months:
                                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                month: "space-y-4",
                                caption:
                                  "flex justify-center pt-1 relative items-center",
                                caption_label: "text-sm font-medium",
                                nav: "space-x-1 flex items-center",
                                nav_button:
                                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell:
                                  "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-green-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-green-50 rounded-md transition-colors",
                                day_selected:
                                  "bg-green-600 text-white hover:bg-green-700 focus:bg-green-600 focus:text-white",
                                day_today: "bg-gray-100 text-gray-900",
                                day_outside: "text-gray-400 opacity-50",
                                day_disabled: "text-gray-400 opacity-50",
                                day_range_middle:
                                  "aria-selected:bg-green-100 aria-selected:text-green-900",
                                day_hidden: "invisible",
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="guests"
                      className="text-sm font-medium text-gray-700"
                    >
                      Guests
                    </Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max={property.max_guests}
                      value={bookingForm.guests.toString()}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setBookingForm((prev) => ({
                            ...prev,
                            guests: 1,
                          }));
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1) {
                            setBookingForm((prev) => ({
                              ...prev,
                              guests: Math.min(numValue, property.max_guests),
                            }));
                          }
                        }
                      }}
                      className={`mt-1 ${
                        bookingForm.guests > property.max_guests
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                    {bookingForm.guests > property.max_guests ? (
                      <p className="text-xs text-red-500 mt-1">
                        Maximum {property.max_guests} guests allowed
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum {property.max_guests} guests
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="requests"
                      className="text-sm font-medium text-gray-700"
                    >
                      Special Requests (Optional)
                    </Label>
                    <Textarea
                      id="requests"
                      placeholder="Any special requests or requirements..."
                      value={bookingForm.special_requests}
                      onChange={(e) =>
                        setBookingForm((prev) => ({
                          ...prev,
                          special_requests: e.target.value,
                        }))
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {bookingForm.check_in_date && bookingForm.check_out_date && (
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>
                          ₹{property.price_per_night.toLocaleString()} ×{" "}
                          {Math.ceil(
                            (bookingForm.check_out_date.getTime() -
                              bookingForm.check_in_date.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          nights
                        </span>
                        <span>₹{calculateTotalPrice().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>
                          ₹
                          {Math.round(
                            calculateTotalPrice() * 0.1
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-3">
                        <span>Total</span>
                        <span>
                          ₹
                          {(
                            calculateTotalPrice() +
                            Math.round(calculateTotalPrice() * 0.1)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
                    onClick={handleBooking}
                    disabled={
                      isBooking ||
                      !bookingForm.check_in_date ||
                      !bookingForm.check_out_date
                    }
                  >
                    {isBooking ? "Processing..." : "Request to Book"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    You won't be charged yet. The host will review your request
                    and respond within 24 hours.
                  </p>

                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-2">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Secure booking</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Instant confirmation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">FS</span>
                  </div>
                  <span className="text-xl font-bold">{siteName}</span>
                </div>
                <p className="text-gray-400">
                  Connecting travelers with authentic farm experiences across
                  India. Discover the beauty of rural life.
                </p>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+91 99999 88888</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Links</h3>
                <div className="space-y-2">
                  <Link
                    href="/properties"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    Browse Properties
                  </Link>
                  <Link
                    href="/about"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">For Hosts</h3>
                <div className="space-y-2">
                  <Link
                    href="/auth/register"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    List Your Property
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    Owner Dashboard
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    Host Support
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Info</h3>
                <div className="space-y-2 text-gray-400">
                  <p>info@farmstayoasis.com</p>
                  <p>+91 99999 88888</p>
                  <p>Hyderabad, Telangana</p>
                  <p>Available 24/7</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>
                &copy; 2024 {siteName}. All rights reserved. | Bringing you
                closer to nature, one farm at a time.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
