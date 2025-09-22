// apps/web/src/components/tenant/bookings/tenant-booking-table-header.tsx
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TenantBookingTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">
          <div className="flex flex-col">
            <span className="font-semibold">Guest Info</span>
          </div>
        </TableHead>

        <TableHead className="w-[180px]">
          <div className="flex flex-col">
            <span className="font-semibold">Property & Room</span>
          </div>
        </TableHead>

        <TableHead className="text-center w-[160px]">
          <div className="flex flex-col">
            <span className="font-semibold">Booking Details</span>
          </div>
        </TableHead>

        <TableHead className="text-center w-[150px]">
          <div className="flex flex-col">
            <span className="font-semibold">Payment Info</span>
          </div>
        </TableHead>

        <TableHead className="text-center w-[120px]">
          <div className="flex flex-col">
            <span className="font-semibold">Status</span>
          </div>
        </TableHead>

        <TableHead className="text-center w-[200px]">
          <div className="flex flex-col">
            <span className="font-semibold">Actions</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
