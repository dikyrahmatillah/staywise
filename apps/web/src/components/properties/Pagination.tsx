import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GetPropertiesQuery } from "@repo/schemas";

interface PaginationProps {
  totalPages: number;
  params: GetPropertiesQuery;
  onPage: (page: number) => void;
}

export function Pagination({ totalPages, params, onPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  const currentPage = params.page || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber: number;
            if (totalPages <= 5) pageNumber = i + 1;
            else if (currentPage <= 3) pageNumber = i + 1;
            else if (currentPage >= totalPages - 2)
              pageNumber = totalPages - 4 + i;
            else pageNumber = currentPage - 2 + i;
            return (
              <Button
                key={pageNumber}
                variant={pageNumber === currentPage ? "default" : "outline"}
                size="sm"
                className="w-10 h-10"
                onClick={() => onPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
