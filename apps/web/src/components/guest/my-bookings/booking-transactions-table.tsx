import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { BookingTransaction } from "@repo/types";
import { BookingTableRow } from "./booking-table-row";
import { BookingCard } from "./booking-card";

interface BookingTransactionsTableProps {
  bookingTransactions: BookingTransaction[];
  onViewDetails?: (booking: BookingTransaction) => void;
  onBookingUpdate?: () => void;
}

export const BookingTransactionsTable = ({
  bookingTransactions,
  onViewDetails,
  onBookingUpdate,
}: BookingTransactionsTableProps) => {
  if (!bookingTransactions || bookingTransactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No booking transactions found</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full">
        {/* Desktop Table - Responsive with scroll on smaller screens */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base font-normal w-[35%] min-w-[200px]">
                    Booking Info
                  </TableHead>
                  <TableHead className="text-base font-normal text-center w-[20%] min-w-[140px]">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-base font-normal text-center w-[20%] min-w-[160px]">
                    Status
                  </TableHead>
                  <TableHead className="text-base font-normal text-center w-[25%] min-w-[180px]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookingTransactions.map((booking) => (
                  <BookingTableRow
                    key={booking.id}
                    booking={booking}
                    onViewDetails={onViewDetails}
                    onBookingUpdate={onBookingUpdate}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {bookingTransactions.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={onViewDetails}
              onBookingUpdate={onBookingUpdate}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};