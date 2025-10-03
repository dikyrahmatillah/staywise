import { Suspense } from "react";
import { BookingContent } from "@/components/guest/booking-transaction/booking-content";

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
