"use client";

import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import type { BookingTransaction } from "@repo/types";
import { BookingTransactionsTable } from "@/components/guest/my-bookings/booking-transactions-table";
import { useBookings } from "@/hooks/useBookings";
import { RefreshCw } from "lucide-react";

export default function GuestBookingPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { bookings, loading, error, fetchBookings } = useBookings();
  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return bookings;

    const statusMap: Record<string, string[]> = {
      pending: ["WAITING_PAYMENT", "WAITING_CONFIRMATION", "PROCESSING"],
      completed: ["COMPLETED"],
      canceled: ["CANCELED", "EXPIRED"],
    };

    return bookings.filter((booking) =>
      statusMap[activeTab]?.includes(booking.status)
    );
  }, [activeTab, bookings]);

  const handleViewDetails = (booking: BookingTransaction) => {
    console.log("Viewing details for booking:", booking.orderCode);
    // Handle view details logic here
  };

  const tabs = [
    { key: "all", label: "All Bookings" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "canceled", label: "Canceled" },
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-600" />
          <p className="mt-2 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchBookings()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-[18px]">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "secondary"}
            className="rounded-[80px] w-[112px] h-10"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Booking Transactions Table */}
      <BookingTransactionsTable
        bookingTransactions={filteredBookings}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
