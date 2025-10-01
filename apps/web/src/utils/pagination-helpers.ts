import type { PaginationInfo } from "@/types/transaction";

/**
 * Generate page numbers for pagination controls
 * Shows up to 5 page numbers centered around current page
 */
export const generatePageNumbers = (pagination: PaginationInfo): number[] => {
  const pages: number[] = [];
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

/**
 * Calculate the range of items being displayed
 */
export const getDisplayRange = (pagination: PaginationInfo) => {
  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);
  return { start, end };
};