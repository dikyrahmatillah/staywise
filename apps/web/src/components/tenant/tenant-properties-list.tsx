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
import { useTenantProperties } from "@/hooks/useTenantProperties";
import type { RoomResponse } from "@repo/schemas";
import { Ellipsis } from "@/components/ui/ellipsis";

interface TenantPropertiesListProps {
  tenantId: string;
}

export function TenantPropertiesList({ tenantId }: TenantPropertiesListProps) {
  const { properties, loading, error, deleteProperty, refetch } =
    useTenantProperties(tenantId);

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }
    await deleteProperty(propertyId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Ellipsis className="text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">{error}</div>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t added any properties to your portfolio yet.
          </p>
          <Button asChild>
            <Link href="/dashboard/tenant/properties/add">
              Add Your First Property
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => {
        const totalRooms = property.Rooms?.length || 0;
        const minPrice =
          property.Rooms?.length > 0
            ? Math.min(
                ...property.Rooms.map((room: RoomResponse) => room.basePrice)
              )
            : 0;
        const maxPrice =
          property.Rooms?.length > 0
            ? Math.max(
                ...property.Rooms.map((room: RoomResponse) => room.basePrice)
              )
            : 0;
        const priceDisplay =
          minPrice === maxPrice
            ? `$${minPrice}`
            : `$${minPrice} - $${maxPrice}`;
        const minGuests =
          property.Rooms?.length > 0
            ? Math.min(
                ...property.Rooms.map(
                  (room: RoomResponse) => room.capacity ?? 1
                )
              )
            : property.maxGuests ?? 0;
        const maxGuests =
          property.Rooms?.length > 0
            ? Math.max(
                ...property.Rooms.map(
                  (room: RoomResponse) => room.capacity ?? 1
                )
              )
            : property.maxGuests ?? 0;
        const guestDisplay =
          minGuests === maxGuests
            ? `${minGuests}`
            : `${minGuests} - ${maxGuests}`;

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
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2"
                    >
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
                            onClick={() => handleDeleteProperty(property.id)}
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
      })}
    </div>
  );
}
