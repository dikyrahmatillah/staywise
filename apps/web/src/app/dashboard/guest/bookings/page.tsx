"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function GuestBookingPage() {
  const [activeTab, setActiveTab] = useState("all");
  return (
    <div className="flex gap-[18px]">
      {[
        "All",
        "Waiting for Payment",
        "In Confirmation",
        "Processing",
        "Completed",
        "Cancelled",
      ].map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "default" : "secondary"}
          className="flex rounded-full h-11 py-4"
          onClick={() => setActiveTab(tab)}
        >
          {tab === "all"
            ? "All Bookings"
            : tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Button>
      ))}
    </div>
  );
}
