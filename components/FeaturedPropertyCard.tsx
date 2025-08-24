"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Property {
  id: string;
  name: string;
  location: string;
  price_per_night: number;
  max_guests: number;
  amenities: string[];
  images: string[];
  rating?: number;
  total_reviews?: number;
  average_rating?: number;
}

interface FeaturedPropertyCardProps {
  property: Property;
}

export default function FeaturedPropertyCard({
  property,
}: FeaturedPropertyCardProps) {
  const handleCardClick = () => {
    window.location.href = `/properties/${property.id}`;
  };

  return (
    <Card
      className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-3">
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={property.images?.[0] || "/placeholder.svg"}
            alt={property.name}
            width={400}
            height={280}
            className="w-full h-70 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-green-600">
            ₹{property.price_per_night.toLocaleString()}/night
          </div>
          <div className="absolute top-4 left-4 bg-green-600 text-white rounded-full px-3 py-1 text-xs font-semibold">
            FEATURED
          </div>
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
            {property.name}
          </h3>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm">{property.location}</span>
          </div>
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
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">Up to {property.max_guests} guests</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.amenities?.slice(0, 3).map((amenity: string, i: number) => (
            <Badge
              key={i}
              variant="secondary"
              className="text-xs bg-green-50 text-green-700 hover:bg-green-100"
            >
              {amenity}
            </Badge>
          ))}
          {property.amenities?.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 text-gray-600"
            >
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>
        <Link
          href={`/properties/${property.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
            View Details & Book
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
