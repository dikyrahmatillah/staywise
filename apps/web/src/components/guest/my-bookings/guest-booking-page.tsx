"use client";

import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import type { BookingTransaction } from "@/types/booking";
import { mockBookingTransactions } from "@/components/guest/my-bookings/mock-bookings";
import { BookingTransactionsTable } from "@/components/guest/my-bookings/booking-transactions-table";

export default function GuestBookingPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return mockBookingTransactions;

    const statusMap: Record<string, string[]> = {
      pending: ["WAITING_PAYMENT", "WAITING_CONFIRMATION", "PROCESSING"],
      complete: ["COMPLETED"],
      cancelled: ["CANCELLED"],
    };

    return mockBookingTransactions.filter((booking) =>
      statusMap[activeTab]?.includes(booking.status)
    );
  }, [activeTab]);

  const handleViewDetails = (booking: BookingTransaction) => {
    console.log("Viewing details for booking:", booking.orderCode);
    // Handle view details logic here
  };

  const tabs = [
    { key: "all", label: "All Bookings" },
    { key: "pending", label: "Pending" },
    { key: "complete", label: "Complete" },
    { key: "cancelled", label: "Cancelled" },
  ];

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
