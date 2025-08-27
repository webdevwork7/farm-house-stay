import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Users,
  Shield,
  Clock,
  Heart,
  Phone,
  Search,
  Calendar,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import FeaturedPropertyCard from "@/components/FeaturedPropertyCard";
import Navbar from "@/components/Navbar";

async function getSiteSettings() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value");

  // Create settings map from database values
  const settingsMap: Record<string, string> = {};

  // First populate with database values
  settings?.forEach((setting) => {
    settingsMap[setting.key] = setting.value;
  });

  // Only use fallbacks if database values don't exist
  const defaultSettings = {
    site_name: "FarmStay Oasis",
    contact_phone: "+91 99999 88888",
    contact_email: "info@farmstayoasis.com",
    hero_title: "Farm House for Rent in",
    hero_subtitle: "Hyderabad & Nearby",
    hero_description:
      "Escape to luxury farm houses within 40 miles of Hyderabad. Perfect for family getaways, corporate retreats, and special celebrations.",
    about_title: "About FarmStay Oasis",
    about_description:
      "We are passionate about connecting people with nature through authentic farmstay experiences. Our carefully curated collection of premium farm houses offers the perfect escape from city life.",
    cta_title: "Ready for Your Farm Adventure?",
    cta_description:
      "Book your perfect farmstay today and create memories that will last a lifetime.",
  };

  // Apply defaults only for missing keys
  Object.keys(defaultSettings).forEach((key) => {
    if (!settingsMap[key]) {
      settingsMap[key] = defaultSettings[key as keyof typeof defaultSettings];
    }
  });

  return settingsMap;
}

async function getFeaturedFarmhouses() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: farmhouses } = await supabase
    .from("farmhouses")
    .select("*")
    .eq("is_active", true)
    .limit(3);

  // STRICTLY USE DATABASE COLUMNS - rating and total_reviews
  const farmhousesWithRatings =
    farmhouses?.map((farmhouse) => ({
      ...farmhouse,
      average_rating: farmhouse.rating || 0, // STRICTLY use database rating column
      total_reviews: farmhouse.total_reviews || 0, // STRICTLY use database total_reviews column
    })) || [];

  return farmhousesWithRatings;
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const featuredFarmhouses = await getFeaturedFarmhouses();

  return (
    <>
      <title>
        {settings.site_name || "Farm Feast Farm House"} - Premium Farm Stays
      </title>
      <div className="min-h-screen">
        <Navbar currentPage="home" />

        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Luxury farmhouse with pool"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="space-y-6">
              {/* Premium Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>Premium Farm House Rentals</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {settings.hero_title ||
                  "Farm House for Rent in Hyderabad & Nearby"}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                {settings.hero_subtitle ||
                  "Escape to luxury farm houses within 40 miles of Hyderabad. Perfect for family getaways, corporate retreats, and special celebrations."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/properties">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Explore Properties
                  </Button>
                </Link>
                <Link href={`tel:${settings.contact_phone || "+919999988888"}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent backdrop-blur-sm"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now: {settings.contact_phone || "+91 99999 88888"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Why Choose {settings.site_name || "FarmStay Oasis"}?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the perfect blend of rural charm and modern comfort
                with our carefully curated farmstay properties.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Verified Properties
                  </h3>
                  <p className="text-gray-600">
                    Every farmstay is personally inspected and verified to
                    ensure quality, safety, and authentic experiences.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Instant Booking
                  </h3>
                  <p className="text-gray-600">
                    Book your perfect farmstay instantly with our streamlined
                    booking system. No waiting, no hassle.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Authentic Experiences
                  </h3>
                  <p className="text-gray-600">
                    Connect with local farmers, participate in farm activities,
                    and experience genuine rural life.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="properties" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Featured Farmstays
              </h2>
              <p className="text-xl text-gray-600">
                Discover our most popular and highly-rated farm properties
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredFarmhouses.map((property, index) => (
                <FeaturedPropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/properties">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent px-8 py-3"
                >
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-amber-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Book your perfect farmstay in just three simple steps
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Connection Line - Hidden on mobile, visible on desktop */}
              <div className="hidden lg:block absolute top-32 left-1/2 transform -translate-x-1/2 w-4/5">
                <div className="h-1 bg-gradient-to-r from-blue-400 via-green-400 to-amber-400 rounded-full"></div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                {[
                  {
                    step: "01",
                    title: "Search & Discover",
                    description:
                      "Browse our curated collection of verified farmstays and find the perfect match for your getaway.",
                    icon: Search,
                    image:
                      "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                    color: "bg-blue-500",
                    bgColor: "bg-blue-100",
                    textColor: "text-blue-600",
                  },
                  {
                    step: "02",
                    title: "Book Instantly",
                    description:
                      "Select your dates, choose your preferences, and book instantly with our secure payment system.",
                    icon: Calendar,
                    image:
                      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                    color: "bg-green-500",
                    bgColor: "bg-green-100",
                    textColor: "text-green-600",
                  },
                  {
                    step: "03",
                    title: "Enjoy Your Stay",
                    description:
                      "Arrive at your farmstay and immerse yourself in authentic rural experiences and warm hospitality.",
                    icon: CheckCircle,
                    image:
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                    color: "bg-amber-500",
                    bgColor: "bg-amber-100",
                    textColor: "text-amber-600",
                  },
                ].map((step, index) => (
                  <div key={index} className="relative text-center group">
                    {/* Step Number Circle */}
                    <div
                      className={`relative z-20 w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      {step.step}
                    </div>

                    {/* Step Content Card */}
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group-hover:-translate-y-2">
                      {/* Image */}
                      <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
                        <Image
                          src={step.image || "/placeholder.svg"}
                          alt={step.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <step.icon className={`w-6 h-6 ${step.textColor}`} />
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                What Our Guests Say
              </h2>
              <p className="text-xl text-gray-600">
                Real experiences from real travelers
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  location: "Bangalore, Karnataka",
                  rating: 5,
                  text: "The most peaceful and rejuvenating vacation we've ever had. The farm activities were amazing and the hosts were incredibly welcoming.",
                  avatar:
                    "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                },
                {
                  name: "Rajesh Kumar",
                  location: "Chennai, Tamil Nadu",
                  rating: 5,
                  text: "Perfect escape from city life. Our kids loved feeding the animals and we enjoyed the fresh farm-to-table meals every day.",
                  avatar:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                },
                {
                  name: "Priya Sharma",
                  location: "Mumbai, Maharashtra",
                  rating: 5,
                  text: "Exceeded all expectations! The property was exactly as described and the booking process was seamless. Will definitely return.",
                  avatar:
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
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
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {`About ${settings.site_name || "FarmStay Oasis"}`}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {settings.about_description ||
                    "We're passionate about connecting travelers with authentic farm experiences. Our platform brings together carefully vetted farm properties and adventure-seeking guests who want to escape the ordinary."}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded by farmers and travel enthusiasts, we understand what
                  makes a truly memorable farmstay experience. Every property on
                  our platform is personally inspected to ensure it meets our
                  high standards for comfort, authenticity, and hospitality.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      500+
                    </div>
                    <div className="text-gray-600">Verified Properties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      10K+
                    </div>
                    <div className="text-gray-600">Happy Guests</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Beautiful farmhouse with lush green surroundings"
                  width={600}
                  height={500}
                  className="w-full h-auto rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Beautiful farm landscape at sunset"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-blue-900/80"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              {settings.cta_title || "Ready for Your Farm Adventure?"}
            </h2>
            <p className="text-xl text-green-100 leading-relaxed">
              {settings.cta_description ||
                "Join thousands of travelers who have discovered the magic of authentic farmstay experiences. Book your perfect getaway today and create memories that will last a lifetime."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  Start Exploring Now
                </Button>
              </Link>
              <Link href="/auth/sign-up?role=owner">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold bg-transparent backdrop-blur-sm"
                >
                  List Your Property
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-8 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Instant Booking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>Verified Properties</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">FS</span>
                  </div>
                  <span className="text-xl font-bold">
                    {settings.site_name || "FarmStay Oasis"}
                  </span>
                </div>
                <p className="text-gray-400">
                  Connecting travelers with authentic farm experiences across
                  India. Discover the beauty of rural life.
                </p>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{settings.contact_phone || "+91 99999 88888"}</span>
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
                    href="/auth/sign-up"
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
                    href="/auth/sign-up?role=owner"
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
                  <p>{settings.contact_email || "info@farmstayoasis.com"}</p>
                  <p>{settings.contact_phone || "+91 99999 88888"}</p>
                  <p>Hyderabad, Telangana</p>
                  <p>Available 24/7</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>
                &copy; 2024 {settings.site_name || "FarmStay Oasis"}. All rights
                reserved. | Bringing you closer to nature, one farm at a time.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
