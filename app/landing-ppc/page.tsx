"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Clock,
  Shield,
  Award,
  Heart,
  TreePine,
  Waves,
  Mountain,
  Camera,
  Share,
  ArrowRight,
  Play,
  MessageCircle,
  Gift,
  Sparkles,
  Home,
  Utensils,
  Tv,
  AirVent,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function LandingPPCPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    message: "",
  });
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [contactPhone, setContactPhone] = useState("+91 99999 88888");
  const [contactEmail, setContactEmail] = useState(
    "info@farmfeastfarmhouse.com"
  );

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const supabase = createClient();
      const { data: settings } = await supabase
        .from("site_settings")
        .select("key, value");

      if (settings) {
        settings.forEach((setting) => {
          if (setting.key === "site_name") setSiteName(setting.value);
          if (setting.key === "contact_phone") setContactPhone(setting.value);
          if (setting.key === "contact_email") setContactEmail(setting.value);
        });
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
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

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in booking a farmstay at ${siteName}. Please share more details.`
    );
    window.open(
      `https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=${message}`,
      "_blank"
    );
  };

  const handleCall = () => {
    window.open(`tel:${contactPhone}`, "_self");
  };

  return (
    <>
      <title>{siteName} - Premium Farm Stay Experience</title>
      <div className="min-h-screen bg-white">
        <Navbar currentPage="landing" />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Premium Farm House Experience</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Escape to Nature's
                    <span className="text-green-600 block">Paradise</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Experience luxury farm living with modern amenities. Perfect
                    for family getaways, corporate retreats, and special
                    celebrations in the heart of nature.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      500+
                    </div>
                    <div className="text-sm text-gray-600">Happy Guests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">4.9</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      24/7
                    </div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={handleWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp Now
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleCall}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg cursor-pointer"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>

              {/* Right Content - Booking Form */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Book Your Stay
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form and we'll get back to you within 2 hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="+91 99999 88888"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn" className="text-sm font-medium">
                        Check-in Date
                      </Label>
                      <Input
                        id="checkIn"
                        name="checkIn"
                        type="date"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut" className="text-sm font-medium">
                        Check-out Date
                      </Label>
                      <Input
                        id="checkOut"
                        name="checkOut"
                        type="date"
                        value={formData.checkOut}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="guests" className="text-sm font-medium">
                      Number of Guests
                    </Label>
                    <Input
                      id="guests"
                      name="guests"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Special Requests (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={3}
                      placeholder="Any special requirements..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                  >
                    Send Booking Request
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to our terms and privacy policy
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Special Pre-Booking Offers Section */}
        <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50 border-y-4 border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Gift className="w-4 h-4" />
                <span>Limited Time Offer</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Special Pre-Booking Offers Available!
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Book now and save up to 30% on your farmstay experience. Limited
                slots available!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2 border-amber-200 bg-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Early Bird Special
                  </h3>
                  <p className="text-3xl font-bold text-amber-600 mb-2">
                    30% OFF
                  </p>
                  <p className="text-gray-600">Book 15 days in advance</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Group Discount
                  </h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    25% OFF
                  </p>
                  <p className="text-gray-600">For groups of 8+ people</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Weekend Special
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    20% OFF
                  </p>
                  <p className="text-gray-600">Friday to Sunday stays</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Claim Offer on WhatsApp
                </Button>
                <Button
                  size="lg"
                  onClick={handleCall}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg cursor-pointer"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call to Book Now
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                *Offers valid for limited time. Terms and conditions apply.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Farm Feast Farm House?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the perfect blend of luxury and nature with our
                premium amenities and authentic farm experiences.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Verified & Safe",
                  description:
                    "All our properties are verified and follow strict safety protocols",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  icon: Award,
                  title: "Premium Quality",
                  description:
                    "Luxury amenities and world-class service for unforgettable stays",
                  color: "bg-amber-100 text-amber-600",
                },
                {
                  icon: Clock,
                  title: "24/7 Support",
                  description:
                    "Round-the-clock assistance for all your needs and queries",
                  color: "bg-green-100 text-green-600",
                },
                {
                  icon: Heart,
                  title: "Authentic Experience",
                  description:
                    "Real farm life experience with modern comfort and convenience",
                  color: "bg-red-100 text-red-600",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center"
                >
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp for Details
                </Button>
                <Button
                  size="lg"
                  onClick={handleCall}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg cursor-pointer"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Luxurious Farmhouse Amenities Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Luxurious Farmhouse Amenities
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience modern luxury in a natural setting with our premium
                amenities and facilities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {[
                {
                  icon: Home,
                  title: "Spacious Rooms",
                  description:
                    "Comfortable AC rooms with modern furnishing and scenic views",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  icon: Utensils,
                  title: "Farm-to-Table Dining",
                  description:
                    "Fresh organic meals prepared with ingredients from our own farm",
                  color: "bg-green-100 text-green-600",
                },
                {
                  icon: Wifi,
                  title: "High-Speed WiFi",
                  description:
                    "Stay connected with complimentary high-speed internet access",
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  icon: Car,
                  title: "Free Parking",
                  description:
                    "Secure parking space for all guests with 24/7 security",
                  color: "bg-gray-100 text-gray-600",
                },
                {
                  icon: Waves,
                  title: "Swimming Pool",
                  description:
                    "Refreshing outdoor pool surrounded by lush greenery",
                  color: "bg-cyan-100 text-cyan-600",
                },
                {
                  icon: TreePine,
                  title: "Nature Walks",
                  description:
                    "Guided nature walks and bird watching experiences",
                  color: "bg-emerald-100 text-emerald-600",
                },
                {
                  icon: Coffee,
                  title: "24/7 Room Service",
                  description:
                    "Round-the-clock room service for your convenience",
                  color: "bg-amber-100 text-amber-600",
                },
                {
                  icon: AirVent,
                  title: "Climate Control",
                  description: "Central AC and heating for year-round comfort",
                  color: "bg-indigo-100 text-indigo-600",
                },
              ].map((amenity, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 ${amenity.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <amenity.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {amenity.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {amenity.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp for Amenities
                </Button>
                <Button
                  size="lg"
                  onClick={handleCall}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg cursor-pointer"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call for Details
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Experience Farm Life
              </h2>
              <p className="text-xl text-gray-600">
                Take a glimpse into the beautiful moments awaiting you
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              ].map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-lg aspect-square"
                >
                  <Image
                    src={image}
                    alt={`Farm experience ${index + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp for Gallery
                </Button>
                <Button
                  size="lg"
                  onClick={handleCall}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg cursor-pointer"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call for Virtual Tour
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What Our Guests Say
              </h2>
              <p className="text-xl text-gray-600">
                Real experiences from real travelers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Priya Sharma",
                  location: "Mumbai, Maharashtra",
                  rating: 5,
                  text: "Absolutely amazing experience! The farm is beautiful, the hosts are wonderful, and our kids had the time of their lives. Highly recommended!",
                  avatar:
                    "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                },
                {
                  name: "Rajesh Kumar",
                  location: "Bangalore, Karnataka",
                  rating: 5,
                  text: "Perfect escape from city life. The property exceeded our expectations and the farm-to-table meals were incredible. Will definitely return!",
                  avatar:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                },
                {
                  name: "Anita Patel",
                  location: "Chennai, Tamil Nadu",
                  rating: 5,
                  text: "The most peaceful and rejuvenating vacation we've ever had. The farm activities were amazing and the hospitality was top-notch.",
                  avatar:
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Reviews
                </Button>
                <Button
                  size="lg"
                  onClick={handleCall}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg cursor-pointer"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call for References
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Book Your Stay Section */}
        <section className="py-20 bg-white border-t-4 border-green-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Easy Booking Process</span>
              </div>

              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                Ready to Book Your Stay?
              </h2>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't wait! Our farmstay experiences book up quickly. Contact us
                now to secure your perfect dates and create unforgettable
                memories.
              </p>

              <div className="grid md:grid-cols-3 gap-8 my-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    WhatsApp Booking
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Quick response within 5 minutes
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Direct Call
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Speak to our booking experts
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    24/7 Support
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Available round the clock
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-xl font-semibold cursor-pointer"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Book via WhatsApp
                </Button>
                <Button
                  size="lg"
                  onClick={handleCall}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-12 py-6 text-xl font-semibold cursor-pointer"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Call {contactPhone}
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                Instant confirmation • Best price guarantee • Free cancellation
                up to 24 hours
              </p>
            </div>
          </div>
        </section>

        {/* Location Map Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Find Us Here
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Located in the heart of nature, easily accessible from major
                cities
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Address
                      </h3>
                      <p className="text-gray-600">
                        Hyderabad, Telangana, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Distance
                      </h3>
                      <p className="text-gray-600">
                        30 minutes from city center
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Car className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Transportation
                      </h3>
                      <p className="text-gray-600">
                        Free pickup available from airport/station
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={handleWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Get Directions on WhatsApp
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleCall}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg cursor-pointer"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call for Pickup
                  </Button>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.3160407725!2d78.24323!3d17.4123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                  title="Farm Feast Farm House Location"
                />
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center rounded-lg">
                  <div className="text-center text-gray-600">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">Hyderabad, Telangana</p>
                    <p className="text-sm">Farm Feast Farm House</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ready for Your Farm Adventure?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Book your perfect farmstay today and create memories that will
              last a lifetime. Limited availability - reserve your dates now!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleWhatsApp}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp: {contactPhone}
              </Button>
              <Button
                size="lg"
                onClick={handleCall}
                variant="outline"
                className="border-white text-black bg-white hover:bg-gray-100 px-8 py-4 text-lg font-semibold cursor-pointer"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now: {contactPhone}
              </Button>
            </div>
          </div>
        </section>

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
                  <span>{contactPhone}</span>
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
                  <p>{contactEmail}</p>
                  <p>{contactPhone}</p>
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
