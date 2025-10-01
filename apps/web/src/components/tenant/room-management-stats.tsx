"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Layers, Users, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/booking-formatters";
import type { Room } from "@/types/room";

interface RoomManagementStatsProps {
  rooms: Room[];
  loading?: boolean;
}

interface RoomStats {
  totalRooms: number;
  totalCapacity: number;
  priceRange: { min: number; max: number };
  mostCommonBedType: string | null;
}

export const RoomManagementStats = ({
  rooms,
  loading,
}: RoomManagementStatsProps) => {
  const stats = useMemo<RoomStats>(() => {
    if (rooms.length === 0) {
      return {
        totalRooms: 0,
        totalCapacity: 0,
        priceRange: { min: 0, max: 0 },
        mostCommonBedType: null,
      };
    }

    const totalCapacity = rooms.reduce(
      (sum, room) => sum + (room.capacity || 0),
      0
    );

    const prices = rooms.map((room) => room.basePrice || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const bedTypeFrequency = rooms.reduce<Record<string, number>>(
      (acc, room) => {
        if (room.bedType) {
          acc[room.bedType] = (acc[room.bedType] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    const mostCommonBedType =
      Object.entries(bedTypeFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      null;

    return {
      totalRooms: rooms.length,
      totalCapacity,
      priceRange: { min: minPrice, max: maxPrice },
      mostCommonBedType,
    };
  }, [rooms]);

  const formatBedType = (type: string | null) => {
    if (!type) return "—";
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const metricCards = useMemo(() => {
    const formatPriceRange = () => {
      const { min, max } = stats.priceRange;
      if (min === max) {
        return formatCurrency(min);
      }
      return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    };

    return [
      {
        title: "Total rooms",
        value: loading ? "…" : stats.totalRooms.toString(),
        description: "Currently in view",
        icon: Bed,
      },
      {
        title: "Total capacity",
        value: loading ? "…" : stats.totalCapacity.toString(),
        description: "Maximum guests per night",
        icon: Users,
      },
      {
        title: "Price range",
        value: loading ? "…" : formatPriceRange(),
        description: "Per room, per night",
        icon: Wallet,
      },
      {
        title: "Popular bed type",
        value: loading ? "…" : formatBedType(stats.mostCommonBedType),
        description: "Across filtered rooms",
        icon: Layers,
      },
    ];
  }, [loading, stats]);

  if (rooms.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
