"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Calendar, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/booking-formatters";
import { useBookings } from "@/hooks/useBookings";
import { useMemo } from "react";

export function EnhancedStats() {
  const { bookings, loading, error } = useBookings();

  // Calculate statistics from the bookings data
  const stats = useMemo(() => {
    if (!bookings || bookings.length === 0) {
      return {
        totalEarning: 0,
        totalGuest: 0,
        totalBooking: 0,
        waitingConfirmation: 0,
      };
    }

    // Calculate total earnings from completed bookings
    const totalEarning = bookings
      .filter(booking => booking.status === 'COMPLETED')
      .reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);

    // Calculate total guests from completed bookings (using qty field)
    const totalGuest = bookings
      .filter(booking => booking.status === 'COMPLETED')
      .reduce((sum, booking) => sum + (booking.qty || 1), 0);

    // Total booking count
    const totalBooking = bookings.length;

    // Count bookings waiting for confirmation
    const waitingConfirmation = bookings
      .filter(booking => booking.status === 'WAITING_CONFIRMATION')
      .length;

    return {
      totalEarning,
      totalGuest,
      totalBooking,
      waitingConfirmation,
    };
  }, [bookings]);

  const dataCards = [
    {
      title: "Total Earning",
      value: loading ? "..." : formatCurrency(stats.totalEarning),
      description: "From completed payments",
      icon: DollarSign,
    },
    {
      title: "Total Guest",
      value: loading ? "..." : stats.totalGuest.toString(),
      description: "Guests with completed payments",
      icon: Users,
    },
    {
      title: "Total Booking",
      value: loading ? "..." : stats.totalBooking.toString(),
      description: "All booking records",
      icon: Calendar,
    },
    {
      title: "Waiting for Confirmation",
      value: loading ? "..." : stats.waitingConfirmation.toString(),
      description: "Pending confirmations",
      icon: Clock,
    },
  ];

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dataCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">Error</div>
              <p className="text-xs text-muted-foreground">
                Failed to load data
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {dataCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}