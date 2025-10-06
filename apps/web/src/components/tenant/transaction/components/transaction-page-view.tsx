import { TransactionsFilters } from "@/components/tenant/transaction/components/transaction-filters";
import { TransactionsList } from "@/components/tenant/transaction/components/transaction-list";
import { EmptyState } from "@/components/tenant/transaction/components/empty-state";
import { LoadingState } from "@/components/tenant/transaction/components/loading-state";
import { ErrorState } from "@/components/tenant/transaction/components/error-state";
import type {
  PaginationInfo,
  TransactionsFilters as FiltersType,
  Booking,
} from "@/types/transaction";

interface TransactionsPageViewProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: FiltersType;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onTabChange: (tab: string) => void;
  onStatusFilterChange: (status: string) => void;
  onPageSizeChange: (size: string) => void;
  onPageChange: (page: number) => void;
  onApprovePayment: (bookingId: string) => Promise<void>;
  onRejectPayment: (bookingId: string) => Promise<void>;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onBookingUpdate: () => void;
  onRetry: () => void;
}

export const TransactionsPageView = ({
  bookings,
  loading,
  error,
  pagination,
  filters,
  hasActiveFilters,
  onSearchChange,
  onTabChange,
  onStatusFilterChange,
  onPageSizeChange,
  onPageChange,
  onApprovePayment,
  onRejectPayment,
  onCancelBooking,
  onBookingUpdate,
  onRetry,
}: TransactionsPageViewProps) => {
  // Loading state (initial load)
  if (loading && bookings.length === 0) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-6 mx-8 my-6">
      {/* Filters Section */}
      <TransactionsFilters
        searchTerm={filters.searchTerm}
        onSearchChange={onSearchChange}
        activeTab={filters.activeTab}
        onTabChange={onTabChange}
        statusFilter={filters.statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        pageSize={filters.pageSize}
        onPageSizeChange={onPageSizeChange}
      />

      {/* Content Section */}
      {bookings.length === 0 ? (
        <EmptyState hasActiveFilters={hasActiveFilters} />
      ) : (
        <TransactionsList
          bookings={bookings}
          pagination={pagination}
          loading={loading}
          onApprovePayment={onApprovePayment}
          onRejectPayment={onRejectPayment}
          onCancelBooking={onCancelBooking}
          onBookingUpdate={onBookingUpdate}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
