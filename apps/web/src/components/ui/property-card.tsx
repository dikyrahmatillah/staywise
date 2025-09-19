"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Users,
  Bed,
  Star,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Building2,
  ImageIcon,
  MoreHorizontal,
  CalendarDays,
  Tags,
} from "lucide-react";
import type { PropertyResponse } from "@repo/schemas";
import {
  formatPriceDisplay,
  formatGuestDisplay,
  getTotalRooms,
} from "@/components/tenant/property-utils";
import usePropertyDetails from "@/hooks/usePropertyDetails";

interface PropertyCardProps {
  property: PropertyResponse;
  onDelete: (id: string) => Promise<void> | void;
}

export default function PropertyCard({
  property,
  onDelete,
}: PropertyCardProps) {
  const totalRooms = getTotalRooms(property);
  const priceDisplay = formatPriceDisplay(property);
  const guestDisplay = formatGuestDisplay(property);
  const { data } = usePropertyDetails(property.slug);
  const averageRating = data?.averageRating ?? undefined;
  const reviewCount = Number(data?.reviewCount ?? 0);

  return (
    <Card
      key={property.id}
      className="overflow-hidden hover:shadow-md transition-shadow"
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto">
            {property.Pictures?.[0]?.imageUrl ? (
              <Image
                src={property.Pictures[0].imageUrl}
                alt={property.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}

            {(property.PropertyCategory || property.CustomCategory) && (
              <Badge variant="secondary" className="absolute top-2 left-2">
                {property.PropertyCategory?.name ||
                  property.CustomCategory?.name}
              </Badge>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-xl">{property.name}</CardTitle>

                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {property.city}, {property.country}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {property.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{guestDisplay} Guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>
                      {totalRooms} {totalRooms === 1 ? "Room" : "Rooms"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{priceDisplay}/night</span>
                  </div>
                  {averageRating !== undefined ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({reviewCount})
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-row sm:flex-col gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/properties/${property.slug}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>

                <Button size="sm" variant="outline" asChild>
                  <Link
                    href={`/dashboard/tenant/properties/${property.id}/edit`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Property
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="h-4 w-4 mr-1" />
                      More
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/tenant/properties/${property.id}/rooms`}
                        className="w-full flex items-center gap-2"
                      >
                        <Bed className="h-4 w-4" />
                        Edit Rooms
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/tenant/properties/${property.id}/availability`}
                        className="w-full flex items-center gap-2"
                      >
                        <CalendarDays className="h-4 w-4" />
                        Room Availability
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/tenant/properties/${property.id}/category`}
                        className="w-full flex items-center gap-2"
                      >
                        <Tags className="h-4 w-4" />
                        Category
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/tenant/properties/${property.id}/pricing`}
                        className="w-full flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        Price Adjustment
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(property.id)}
                      className="text-red-600 focus:text-red-600 cursor-pointer flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Property
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                <span>Property ID: {property.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
