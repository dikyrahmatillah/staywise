import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TenantBookingTableHeader } from "@/components/tenant/transaction/components/booking-table-header";

interface EmptyStateProps {
  hasActiveFilters: boolean;
}

export const EmptyState = ({ hasActiveFilters }: EmptyStateProps) => {
  return (
    <Table>
      <TenantBookingTableHeader />
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="px-6 py-4 text-center">
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? "No bookings match your current filters."
                  : "Bookings Not Found."}
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
