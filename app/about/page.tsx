import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Shield, Heart, Award, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <Link href="/" className="text-xl font-bold text-green-800">
                FarmStay Oasis
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/properties"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Properties
              </Link>
              <Link href="/about" className="text-green-600 font-medium">
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-green-700 hover:text-green-800"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Our Story
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
              About <span className="text-green-600">FarmStay Oasis</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Connecting travelers with authentic farm experiences across India.
              We're passionate about preserving rural heritage while creating
              unforgettable memories.
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
                FarmStay Oasis was born from a simple belief: that the most
                meaningful travel experiences happen when we connect with local
                communities and embrace authentic ways of life.
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
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Farmers working together in the field"
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
                  meaningful connections through authentic farmstay experiences.
                  We believe that travel should be transformative, sustainable,
                  and beneficial to local communities.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
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
              The passionate people behind FarmStay Oasis
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
                    <p className="text-green-600 font-medium">{member.role}</p>
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
            <p className="text-xl text-gray-600">Numbers that tell our story</p>
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
            Whether you're looking for your next adventure or want to share your
            farm with travelers, we'd love to have you.
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FS</span>
                </div>
                <span className="text-xl font-bold">FarmStay Oasis</span>
              </div>
              <p className="text-gray-400">
                Connecting travelers with authentic farm experiences across
                India.
              </p>
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
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>info@farmstayoasis.com</p>
                <p>+91 99999 88888</p>
                <p>Hyderabad, Telangana</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FarmStay Oasis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
