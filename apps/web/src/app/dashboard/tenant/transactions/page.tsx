// apps/web/src/app/tenant/bookings/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { TenantBookingTableHeader } from "@/components/tenant/booking-table/header";
import { TenantBookingTableRow } from "@/components/tenant/booking-table/row";
import { useBookings } from "@/hooks/useBookings";
import { useDebounce } from "@/hooks/use-debounce";

export default function TenantBookingsPage() {
  const { 
    bookings, 
    loading, 
    error, 
    pagination,
    fetchBookings, 
    approvePaymentProof, 
    rejectPaymentProof 
  } = useBookings();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Calculate counts for tabs (these might need to come from a separate API call for accuracy)
  const tabCounts = useMemo(() => {
    // Note: These counts are from current page only, not total
    // Consider adding separate endpoint for counts or include in API response
    const pendingApprovals = bookings.filter(booking => 
      booking.status === "WAITING_CONFIRMATION" && 
      booking.paymentMethod === "MANUAL_TRANSFER"
    ).length;
    
    const activeBookings = bookings.filter(booking => 
      ["WAITING_PAYMENT", "WAITING_CONFIRMATION", "PROCESSING"].includes(booking.status)
    ).length;
    
    const completedBookings = bookings.filter(booking => 
      booking.status === "COMPLETED"
    ).length;

    return {
      pendingApprovals,
      activeBookings,
      completedBookings
    };
  }, [bookings]);

  // Fetch data when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearchTerm || undefined,
      status: getStatusForAPI()
    };
    
    fetchBookings(params);
  }, [currentPage, pageSize, debouncedSearchTerm, statusFilter, activeTab, fetchBookings]);

  // Convert UI filters to API status parameter
  const getStatusForAPI = () => {
    if (activeTab !== "all") {
      switch (activeTab) {
        case "pending":
          return "WAITING_CONFIRMATION"; // Will need additional filtering for MANUAL_TRANSFER
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

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
    setStatusFilter("all"); // Clear status filter when changing tabs
  };

  // Handle status filter changes
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Handle search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle approve payment using useBookings hook
  const handleApprovePayment = async (bookingId: string) => {
    await approvePaymentProof(bookingId);
  };

  // Handle reject payment using useBookings hook
  const handleRejectPayment = async (bookingId: string) => {
    await rejectPaymentProof(bookingId);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!pagination) return [];
    
    const pages = [];
    const totalPages = pagination.totalPages;
    const current = pagination.page;
    
    // Show up to 5 page numbers
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(totalPages, current + 2);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-600">Error loading bookings: {error}</p>
          <Button onClick={() => fetchBookings()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order code, guest name, or property..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="WAITING_PAYMENT">Waiting Payment</SelectItem>
                  <SelectItem value="WAITING_CONFIRMATION">Waiting Confirmation</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Booking Table with Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({pagination?.total ?? bookings.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({tabCounts.pendingApprovals})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({tabCounts.activeBookings})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({tabCounts.completedBookings})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || activeTab !== "all"
                  ? "No bookings match your current filters."
                  : "No bookings found."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TenantBookingTableHeader />
                  <TableBody>
                    {bookings.map((booking) => (
                      <TenantBookingTableRow
                        key={booking.id}
                        booking={booking}
                        onApprovePayment={handleApprovePayment}
                        onRejectPayment={handleRejectPayment}
                        onBookingUpdate={() => fetchBookings({
                          page: currentPage,
                          limit: pageSize,
                          search: debouncedSearchTerm || undefined,
                          status: getStatusForAPI()
                        })}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrevPage || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {generatePageNumbers().map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className="w-8"
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage || loading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}