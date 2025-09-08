import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Bed, Bath, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const totalBedrooms = property.Rooms?.length || 1;
  const totalBathrooms = property.Rooms?.length || 1;
  const basePrice = property.Rooms?.[0]?.basePrice || 120;

  return (
    <Card
      key={property.id}
      className="overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[16/9]">
        <Image
          src={property.Pictures[0]?.imageUrl}
          alt={property.name}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-3 left-3">Available</Badge>
        {property.PropertyCategory && (
          <Badge variant="secondary" className="absolute top-3 right-3">
            {property.PropertyCategory.name}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-lg">{property.name}</CardTitle>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4" />
            <span>{property.city}</span>
          </div>
        </CardHeader>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{property.maxGuests || 4} Guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{totalBedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{totalBathrooms} Bathrooms</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.8</span>
          </div>
          <span className="text-muted-foreground">(139 reviews)</span>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold">${basePrice}</span>
            <span className="text-muted-foreground">/night</span>
          </div>
          <Link href={`/properties/${property.slug}`}>
            <Button>View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
