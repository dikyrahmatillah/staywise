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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your booking history
          </p>
        </div>
        <Button variant="outline" onClick={() => fetchBookings()} disabled={loading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
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

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {activeTab === "all"
              ? "You haven't made any bookings yet."
              : `No ${activeTab} bookings found.`}
          </p>
        </div>
      ) : (
        <BookingTransactionsTable
          bookingTransactions={filteredBookings}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
}
