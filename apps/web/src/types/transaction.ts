import type { BookingTransaction } from "@/types";

export type TransactionTab = "all" | "pending" | "active" | "completed";

export type TransactionStatus =
  | "all"
  | "WAITING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELED";

// Use the existing BookingTransaction type from your shared types package
export type Booking = BookingTransaction;

export interface TransactionsFilters {
  searchTerm: string;
  statusFilter: TransactionStatus;
  activeTab: TransactionTab;
  pageSize: number;
  currentPage: number;
}

export interface TransactionsFetchParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface TransactionsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: TransactionTab;
  onTabChange: (tab: string) => void;
  statusFilter: TransactionStatus;
  onStatusFilterChange: (status: string) => void;
  pageSize: number;
  onPageSizeChange: (size: string) => void;
}

export interface TransactionsPaginationProps {
  pagination: PaginationInfo;
  loading: boolean;
  onPageChange: (page: number) => void;
}