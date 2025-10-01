// components/TransactionsFilters.tsx

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
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
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex gap-4 flex-1">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order code, guest name, or property..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid grid-cols-4 mx-auto">
            <TabsTrigger value="all" className="flex px-4">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex px-4">
              Pending
            </TabsTrigger>
            <TabsTrigger value="active" className="flex px-4">
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex px-4">
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[140px] truncate">
            <Filter className="h-4 w-4 mr-2" />
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
  );
};
