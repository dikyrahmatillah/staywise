import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BookingTransaction } from "@/types/booking";
import { BookingTableRow } from "./booking-table-row";
import { BookingCard } from "./booking-card";

interface BookingTransactionsTableProps {
  bookingTransactions: BookingTransaction[];
  onViewDetails?: (booking: BookingTransaction) => void;
}

export const BookingTransactionsTable = ({
  bookingTransactions,
  onViewDetails,
}: BookingTransactionsTableProps) => {
  if (!bookingTransactions || bookingTransactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No booking transactions found</p>
      </div>
    );
  }
  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base font-normal" colSpan={2}>
                Property & Room
              </TableHead>
              <TableHead className="text-base font-normal text-center">
                Booking Info
              </TableHead>
              <TableHead className="text-base font-normal text-center">
                Total Amount
              </TableHead>
              <TableHead className="text-base font-normal text-center">
                Status
              </TableHead>
              <TableHead className="text-base font-normal text-center">
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
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {bookingTransactions.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Empty State */}
      {bookingTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No booking transactions found</p>
        </div>
      )}
    </div>
  );
};
