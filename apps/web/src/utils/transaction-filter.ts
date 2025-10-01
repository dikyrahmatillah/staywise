// COPY THIS ENTIRE FILE TO ONE OF THESE LOCATIONS:
// Option A (Local): apps/web/src/app/dashboard/tenant/transactions/utils/transactionFilters.ts
// Option B (Global): apps/web/src/utils/transaction-filter.ts

// Type definitions
export type TransactionTab = "all" | "pending" | "active" | "completed";

export type TransactionStatus =
  | "all"
  | "WAITING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELED";

/**
 * Convert UI filters to API status parameter
 * @param activeTab - The currently active tab
 * @param statusFilter - The selected status filter
 * @returns Status string for API or undefined
 */
export const getStatusForAPI = (
  activeTab: TransactionTab,
  statusFilter: TransactionStatus
): string | undefined => {
  if (activeTab !== "all") {
    switch (activeTab) {
      case "pending":
        return "WAITING_CONFIRMATION";
      case "active":
        return "WAITING_PAYMENT,WAITING_CONFIRMATION,PROCESSING";
      case "completed":
        return "COMPLETED";
      default:
        return statusFilter !== "all" ? statusFilter : undefined;
    }
  }
  return statusFilter !== "all" ? statusFilter : undefined;
};

/**
 * Determine if user has applied any filters
 * @param searchTerm - Search input value
 * @param statusFilter - Selected status filter
 * @param activeTab - Active tab
 * @returns True if any filter is active
 */
export const hasActiveFilters = (
  searchTerm: string,
  statusFilter: TransactionStatus,
  activeTab: TransactionTab
): boolean => {
  return (
    searchTerm.length > 0 || statusFilter !== "all" || activeTab !== "all"
  );
};

// THEN UPDATE YOUR page.tsx IMPORT:
// 
// If you saved this at Option A (local):
// import { getStatusForAPI, hasActiveFilters } from "./utils/transactionFilters";
//
// If you saved this at Option B (global):
// import { getStatusForAPI, hasActiveFilters } from "@/utils/transaction-filter";