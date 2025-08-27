"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Shield, Heart, Award, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [siteName, setSiteName] = useState("Farm Feast Farm House");

  useEffect(() => {
    fetchSiteSettings();
  }, []);

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
  return (
    <>
      <title>About Us - {siteName}</title>
      <div className="min-h-screen">
        <Navbar currentPage="about" />

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Our Story
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                About <span className="text-green-600">{siteName}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connecting travelers with authentic farm experiences across
                India. We're passionate about preserving rural heritage while
                creating unforgettable memories.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Our Story
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded in 2020 by a group of farmers and travel enthusiasts,
                  {siteName} was born from a simple belief: that the most
                  meaningful travel experiences happen when we connect with
                  local communities and embrace authentic ways of life.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  What started as a small network of family farms near Hyderabad
                  has grown into India's premier farmstay booking platform,
                  featuring over 500 carefully curated properties across the
                  country. Each farmstay is personally inspected by our team to
                  ensure it meets our high standards for comfort, authenticity,
                  and hospitality.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, we're proud to have facilitated over 50,000 bookings,
                  helping travelers discover the beauty of rural India while
                  supporting local farming communities.
                </p>
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

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Our Mission
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    To bridge the gap between urban and rural India by creating
                    meaningful connections through authentic farmstay
                    experiences. We believe that travel should be
                    transformative, sustainable, and beneficial to local
                    communities.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Our Vision
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    To become India's most trusted platform for rural tourism,
                    preserving traditional farming practices while providing
                    sustainable income opportunities for farming families across
                    the country.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Authenticity",
                  description:
                    "Every farmstay offers genuine rural experiences with real farming families.",
                  color: "bg-green-100 text-green-600",
                },
                {
                  icon: Users,
                  title: "Community",
                  description:
                    "Supporting local communities and preserving traditional ways of life.",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  icon: Heart,
                  title: "Sustainability",
                  description:
                    "Promoting eco-friendly practices and responsible tourism.",
                  color: "bg-red-100 text-red-600",
                },
                {
                  icon: Award,
                  title: "Quality",
                  description:
                    "Maintaining the highest standards in accommodation and service.",
                  color: "bg-amber-100 text-amber-600",
                },
              ].map((value, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center"
                >
                  <CardContent className="p-6 space-y-4">
                    <div
                      className={`w-16 h-16 ${
                        value.color.split(" ")[0]
                      } rounded-full flex items-center justify-center mx-auto`}
                    >
                      <value.icon
                        className={`w-8 h-8 ${value.color.split(" ")[1]}`}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600">
                The passionate people behind {siteName}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Rajesh Patel",
                  role: "Founder & CEO",
                  bio: "Former software engineer turned farmer, passionate about sustainable agriculture and rural tourism.",
                  image:
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                },
                {
                  name: "Priya Sharma",
                  role: "Head of Operations",
                  bio: "Travel industry veteran with 15+ years experience in hospitality and customer service.",
                  image:
                    "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                },
                {
                  name: "Arjun Kumar",
                  role: "Technology Director",
                  bio: "Tech enthusiast building innovative solutions to connect travelers with authentic experiences.",
                  image:
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                },
              ].map((member, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="w-30 h-30 rounded-full mx-auto object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-green-600 font-medium">
                        {member.role}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Our Impact
              </h2>
              <p className="text-xl text-gray-600">
                Numbers that tell our story
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Verified Properties", icon: MapPin },
                { number: "50K+", label: "Happy Guests", icon: Users },
                { number: "4.9", label: "Average Rating", icon: Star },
                { number: "24/7", label: "Customer Support", icon: Phone },
              ].map((stat, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <stat.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-4xl font-bold text-green-600">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Join Our Community
            </h2>
            <p className="text-xl text-green-100">
              Whether you're looking for your next adventure or want to share
              your farm with travelers, we'd love to have you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
                >
                  Explore Properties
                </Button>
              </Link>
              <Link href="/auth/sign-up?role=owner">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 bg-transparent"
                >
                  Become a Host
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
