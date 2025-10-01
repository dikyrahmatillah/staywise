// apps/web/src/components/tenant/transaction/components/property-room-info.tsx

import { useBookingRow } from "../context/booking-row-context";

export const PropertyRoomInfo = () => {
  const { booking } = useBookingRow();
  const { Property: property, Room: room } = booking;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-sm truncate max-w-[150px]">
        {property.name}
      </span>
      <span className="text-xs text-muted-foreground">{room.name}</span>
    </div>
  );
};