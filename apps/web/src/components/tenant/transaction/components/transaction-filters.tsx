import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, X } from "lucide-react";
import type { TransactionsFiltersProps } from "@/types/transaction";

export const TransactionsFilters = ({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  statusFilter,
  onStatusFilterChange,
  pageSize,
  onPageSizeChange,
}: TransactionsFiltersProps) => {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* First Row: Search, Status Filter, Page Size */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
        {/* Search Input - Takes more space on desktop */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order code, guest name, or property..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {/* Clear button - only show when there's text */}
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter and Page Size - Grouped together */}
        <div className="flex gap-2 sm:gap-3">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="h-4 w-4 mr-2 shrink-0" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="WAITING_PAYMENT">Waiting Payment</SelectItem>
              <SelectItem value="WAITING_CONFIRMATION">
                Waiting Confirmation
              </SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectContent>
          </Select>

          {/* Page Size Selector */}
          <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
            <SelectTrigger className="w-full sm:w-[130px]">
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

      {/* Second Row: Tabs - Centered */}
      <div className="flex justify-center w-full">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all" className="px-4 sm:px-6">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="px-4 sm:px-6">
              Pending
            </TabsTrigger>
            <TabsTrigger value="active" className="px-4 sm:px-6">
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="px-4 sm:px-6">
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};