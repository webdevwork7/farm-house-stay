"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Users,
  Search,
  Filter,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
  average_rating?: number;
  total_reviews?: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Farmhouse[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Farmhouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteName, setSiteName] = useState("Farm Feast Farm House");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [guestsFilter, setGuestsFilter] = useState("all");

  useEffect(() => {
    fetchProperties();
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, locationFilter, priceFilter, guestsFilter]);

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

  const fetchProperties = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("farmhouses")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        return;
      }

      // STRICTLY USE DATABASE COLUMNS - rating and total_reviews
      const propertiesWithRatings =
        data?.map((property) => ({
          ...property,
          average_rating: property.rating || 0, // STRICTLY use database rating column
          total_reviews: property.total_reviews || 0, // STRICTLY use database total_reviews column
        })) || [];

      setProperties(propertiesWithRatings);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      filtered = filtered.filter((property) => {
        const price = property.price_per_night;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    // Guests filter
    if (guestsFilter !== "all") {
      const guests = Number.parseInt(guestsFilter);
      filtered = filtered.filter((property) => property.max_guests >= guests);
    }

    setFilteredProperties(filtered);
  };

  const getUniqueLocations = () => {
    const locations = properties.map((p) => p.location);
    return [...new Set(locations)];
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: any } = {
      wifi: Wifi,
      parking: Car,
      breakfast: Coffee,
      kitchen: Coffee,
      pool: "🏊",
      garden: "🌿",
      fireplace: "🔥",
      bbq: "🍖",
    };
    const IconComponent = icons[amenity.toLowerCase()];
    if (typeof IconComponent === "string") {
      return <span className="text-sm">{IconComponent}</span>;
    }
    return IconComponent ? (
      <IconComponent className="w-4 h-4" />
    ) : (
      <CheckCircle className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="properties" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="border-0 shadow-lg overflow-hidden animate-pulse"
              >
                <div className="bg-gray-300 h-60 w-full"></div>
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Properties - {siteName}</title>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="properties" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Amazing Farmstays
            </h1>
            <p className="text-gray-600">
              Find your perfect rural getaway from our collection of verified
              properties
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {getUniqueLocations().map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-5000">₹0 - ₹5,000</SelectItem>
                  <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                  <SelectItem value="10000-15000">₹10,000 - ₹15,000</SelectItem>
                  <SelectItem value="15000">₹15,000+</SelectItem>
                </SelectContent>
              </Select>
              <Select value={guestsFilter} onValueChange={setGuestsFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Size</SelectItem>
                  <SelectItem value="2">2+ Guests</SelectItem>
                  <SelectItem value="4">4+ Guests</SelectItem>
                  <SelectItem value="6">6+ Guests</SelectItem>
                  <SelectItem value="8">8+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1 ? "property" : "properties"}{" "}
              found
            </p>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                return (
                  <Card
                    key={property.id}
                    className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/properties/${property.id}`)
                    }
                  >
                    <div className="p-2">
                      <div className="relative overflow-hidden rounded-lg">
                        <Image
                          src={
                            property.images[0] ||
                            `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80` ||
                            "/placeholder.svg"
                          }
                          alt={property.name}
                          width={400}
                          height={280}
                          className="w-full h-70 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-green-600 shadow-lg">
                          ₹{property.price_per_night.toLocaleString()}/night
                        </div>
                        <div className="absolute bottom-4 left-4 bg-green-600 text-white rounded-full px-3 py-1 text-xs font-semibold shadow-lg">
                          VERIFIED
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                          {property.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {property.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
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
                          <span className="text-sm font-medium">
                            {property.average_rating
                              ? property.average_rating.toFixed(1)
                              : "0.0"}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({property.total_reviews || 0} reviews)
                          </span>
                        </div>
                        <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                          Available
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{property.max_guests}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bath className="w-4 h-4" />
                            <span>{property.bathrooms}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {property.amenities.slice(0, 4).map((amenity, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-full"
                          >
                            {getAmenityIcon(amenity)}
                            <span className="text-xs text-gray-700 capitalize">
                              {amenity}
                            </span>
                          </div>
                        ))}
                        {property.amenities.length > 4 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-600"
                          >
                            +{property.amenities.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <Link href={`/properties/${property.id}`}>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 transition-all duration-200 hover:shadow-lg">
                          View Details & Book
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
