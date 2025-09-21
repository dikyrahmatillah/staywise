"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Bed, Users, Calendar } from "lucide-react";
import { useTenantProperties } from "@/hooks/useTenantProperties";
import { getGuestRange } from "@/components/tenant/property-utils";

interface PropertyStatsProps {
  tenantId: string;
}

interface PropertyStats {
  totalProperties: number;
  totalRooms: number;
  totalCapacity: number;
  totalBookings: number;
}

export function PropertyStats({ tenantId }: PropertyStatsProps) {
  const { properties, loading } = useTenantProperties(tenantId);
  const [stats, setStats] = useState<PropertyStats>({
    totalProperties: 0,
    totalRooms: 0,
    totalCapacity: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    if (properties.length > 0) {
      const calculatedStats = properties.reduce(
        (acc: PropertyStats, property) => {
          acc.totalProperties += 1;
          acc.totalRooms += property.Rooms?.length || 0;
          type PropLike = { Rooms?: unknown[]; maxGuests?: number };
          const { max } = getGuestRange(property as PropLike);
          acc.totalCapacity += max || 0;

          const bookings = property._count?.Bookings ?? 0;
          acc.totalBookings += bookings;

          return acc;
        },
        {
          totalProperties: 0,
          totalRooms: 0,
          totalCapacity: 0,
          totalBookings: 0,
        }
      );

      setStats(calculatedStats);
    } else {
      setStats({
        totalProperties: 0,
        totalRooms: 0,
        totalCapacity: 0,
        totalBookings: 0,
      });
    }
  }, [properties]);

  const statsCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
      description: "Active listings",
      icon: Building2,
    },
    {
      title: "Total Rooms",
      value: stats.totalRooms,
      description: "Across all properties",
      icon: Bed,
    },
    {
      title: "Total Capacity",
      value: stats.totalCapacity,
      description: "Maximum guests",
      icon: Users,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      description: "All bookings across properties",
      icon: Calendar,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : card.value}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
