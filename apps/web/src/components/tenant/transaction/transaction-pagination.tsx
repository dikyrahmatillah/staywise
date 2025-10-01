import { Button } from "@/components/ui/button";
import { TableFooter, TableRow, TableCell } from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  generatePageNumbers,
  getDisplayRange,
} from "@/utils/pagination-helpers";
import type { TransactionsPaginationProps } from "@/types/transaction";

export const TransactionsPagination = ({
  pagination,
  loading,
  onPageChange,
}: TransactionsPaginationProps) => {
  const pageNumbers = generatePageNumbers(pagination);
  const { start, end } = getDisplayRange(pagination);

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={100} className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Info Text */}
            <div className="text-sm text-muted-foreground">
              PAGE {pagination.page} OF {pagination.totalPages} ({start} to{" "}
              {end} from {pagination.total} total bookings)
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              {/* First Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={pagination.page === 1 || loading}
                className="px-2"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Previous Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage || loading}
                className="px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {pageNumbers.map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={
                      pageNum === pagination.page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                    className="w-8 h-8"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>

              {/* Next Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Last Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages || loading}
                className="px-2"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};
