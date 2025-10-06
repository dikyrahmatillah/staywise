"use client";

import { useEffect, useCallback } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useDebounce } from "@/hooks/use-debounce";
import { useTransactionsFilters } from "@/hooks/use-transaction-filters";
import { TransactionsPageView } from "@/components/tenant/transaction/components/transaction-page-view";
import { getStatusForAPI, hasActiveFilters } from "@/utils/transaction-filter";
import type { TransactionsFetchParams } from "@/types/transaction";

export default function TenantBookingsPage() {
  // Bookings data and actions
  const {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    approvePaymentProof,
    rejectPaymentProof,
    cancelBooking,
  } = useBookings();

  // Filter state management
  const { filters, handlers } = useTransactionsFilters();

  // Debounce search term
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

  // Build fetch parameters
  const getFetchParams = useCallback((): TransactionsFetchParams => {
    return {
      page: filters.currentPage,
      limit: filters.pageSize,
      search: debouncedSearchTerm || undefined,
      status: getStatusForAPI(filters.activeTab, filters.statusFilter),
    };
  }, [
    filters.currentPage,
    filters.pageSize,
    filters.activeTab,
    filters.statusFilter,
    debouncedSearchTerm,
  ]);

  // Fetch bookings when filters change
  useEffect(() => {
    fetchBookings(getFetchParams());
  }, [fetchBookings, getFetchParams]);

  // Handle approve payment
  const handleApprovePayment = async (bookingId: string) => {
    await approvePaymentProof(bookingId);
  };

  // Handle reject payment
  const handleRejectPayment = async (bookingId: string) => {
    await rejectPaymentProof(bookingId);
  };

  // Handle booking update (refresh current page)
  const handleBookingUpdate = useCallback(() => {
    fetchBookings(getFetchParams());
  }, [fetchBookings, getFetchParams]);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    fetchBookings(getFetchParams());
  }, [fetchBookings, getFetchParams]);

  // Check if user has active filters
  const filtersActive = hasActiveFilters(
    filters.searchTerm,
    filters.statusFilter,
    filters.activeTab
  );

  return (
    <TransactionsPageView
      bookings={bookings}
      loading={loading}
      error={error}
      pagination={pagination}
      filters={filters}
      hasActiveFilters={filtersActive}
      onSearchChange={handlers.handleSearchChange}
      onTabChange={handlers.handleTabChange}
      onStatusFilterChange={handlers.handleStatusFilterChange}
      onPageSizeChange={handlers.handlePageSizeChange}
      onPageChange={handlers.handlePageChange}
      onApprovePayment={handleApprovePayment}
      onRejectPayment={handleRejectPayment}
      onCancelBooking={cancelBooking}
      onBookingUpdate={handleBookingUpdate}
      onRetry={handleRetry}
    />
  );
}
