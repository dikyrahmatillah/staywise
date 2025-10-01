// components/TransactionsList.tsx

import { Table, TableBody } from "@/components/ui/table";
import { TenantBookingTableHeader } from "@/components/tenant/transaction/components/booking-table-header";
import { TenantBookingTableRow } from "@/components/tenant/transaction/table-row/booking-table-row";
import { TransactionsPagination } from "@/components/tenant/transaction/components/transaction-pagination";
import type { Booking, PaginationInfo } from "@/types/transaction";

interface TransactionsListProps {
  bookings: Booking[]; // ✅ NOT any[]
  pagination: PaginationInfo;
  loading: boolean;
  onApprovePayment: (bookingId: string) => Promise<void>;
  onRejectPayment: (bookingId: string) => Promise<void>;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onBookingUpdate: () => void;
  onPageChange: (page: number) => void;
}

export const TransactionsList = ({
  bookings,
  pagination,
  loading,
  onApprovePayment,
  onRejectPayment,
  onCancelBooking,
  onBookingUpdate,
  onPageChange,
}: TransactionsListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TenantBookingTableHeader />
        <TableBody>
          {bookings.map((booking) => (
            <TenantBookingTableRow
              key={booking.id}
              booking={booking}
              onApprovePayment={onApprovePayment}
              onRejectPayment={onRejectPayment}
              onCancelBooking={onCancelBooking}
              onBookingUpdate={onBookingUpdate}
            />
          ))}
        </TableBody>

        <TransactionsPagination
          pagination={pagination}
          loading={loading}
          onPageChange={onPageChange}
        />
      </Table>
    </div>
  );
};
