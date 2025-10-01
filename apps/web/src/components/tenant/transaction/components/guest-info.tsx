// apps/web/src/components/tenant/transaction/components/guest-info.tsx

import { User, Mail } from "lucide-react";
import { useBookingRow } from "../context/booking-row-context";

export const GuestInfo = () => {
  const { booking } = useBookingRow();
  const { User: user } = booking;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">
          {user.firstName} {user.lastName}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
          {user.email}
        </span>
      </div>
    </div>
  );
};