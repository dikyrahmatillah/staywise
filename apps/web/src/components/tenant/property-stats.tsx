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
      description: "Active bookings across properties",
      icon: Calendar,
    },
  ];

  if (loading) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((card, index) => (
        <Card
          key={index}
          className="border-0 bg-card/50 backdrop-blur-sm shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <card.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
