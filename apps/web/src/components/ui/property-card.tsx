"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  MapPin,
  Users,
  Bed,
  Star,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  Building2,
  ImageIcon,
} from "lucide-react";
import type { PropertyResponse } from "@repo/schemas";
import {
  formatPriceDisplay,
  formatGuestDisplay,
  getTotalRooms,
} from "@/components/tenant/property-utils";
import usePropertyDetails from "@/hooks/usePropertyDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PropertyCardProps {
  property: PropertyResponse;
  onDelete: (id: string) => Promise<void> | void;
}

export default function PropertyCard({
  property,
  onDelete,
}: PropertyCardProps) {
  const [openDelete, setOpenDelete] = useState(false);
  const totalRooms = getTotalRooms(property);
  const priceDisplay = formatPriceDisplay(property);
  const guestDisplay = formatGuestDisplay(property);
  const { data } = usePropertyDetails(property.slug);
  const averageRating = data?.averageRating ?? undefined;
  const reviewCount = Number(data?.reviewCount ?? 0);

  return (
    <Card
      key={property.id}
      className="overflow-hidden hover:shadow-md transition-shadow py-0"
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-64 aspect-[16/9] sm:aspect-[4/3]">
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

          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-lg sm:text-xl">
                  {property.name}
                </CardTitle>

                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {property.city}, {property.country}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {property.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
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

              <div className="flex flex-row sm:flex-col gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto justify-center"
                >
                  <Link href={`/properties/${property.slug}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto justify-center"
                >
                  <Link
                    href={`/dashboard/tenant/properties/${property.id}/edit`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Property
                  </Link>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto justify-center"
                >
                  <Link
                    href={`/dashboard/tenant/properties/${property.id}/rooms`}
                  >
                    <Bed className="h-4 w-4 mr-1" />
                    Edit Rooms
                  </Link>
                </Button>
              </div>
            </div>

            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Property</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this property? This action
                    cannot be undone and will remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setOpenDelete(false);
                      onDelete(property.id);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Property
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row flex-wrap gap-4 text-xs text-muted-foreground">
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
