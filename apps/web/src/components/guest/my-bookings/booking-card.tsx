"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BookingTransaction } from "@repo/types";
import { PropertyInfo } from "@/components/guest/my-bookings/property-info";
import { BookingInfo } from "@/components/guest/my-bookings/booking-info";
import { PaymentInfo } from "@/components/guest/my-bookings/payment-info";
import { StatusBadge } from "@/components/guest/my-bookings/status-badge";

interface BookingCardProps {
  booking: BookingTransaction;
  onViewDetails?: (booking: BookingTransaction) => void;
}

export const BookingCard = ({ booking, onViewDetails }: BookingCardProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Property & Room Info */}
          <PropertyInfo property={booking.Property} room={booking.Room} />

          {/* Booking Details */}
          <div className="grid grid-cols-2 gap-4">
            <BookingInfo
              orderCode={booking.orderCode}
              checkInDate={booking.checkInDate}
              checkOutDate={booking.checkOutDate}
              nights={booking.nights}
            />
            <div className="text-right">
              <PaymentInfo
                totalAmount={booking.totalAmount}
                paymentMethod={booking.paymentMethod}
              />
            </div>
          </div>

          {/* Status and Action */}
          <div className="flex items-center justify-between">
            <StatusBadge status={booking.status} />
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-6 h-10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
              onClick={() => onViewDetails?.(booking)}
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
