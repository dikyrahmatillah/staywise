import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TenantBookingTableHeader = () => {
  return (
    <TableHeader className="">
      <TableRow className="h-16 bg-gray-50">
        <TableHead className="w-[200px]">
          <div className="flex flex-col">
            <span className="font-semibold text-[16px] font-sans">
              Guest Info
            </span>
          </div>
        </TableHead>

        <TableHead className="w-[180px]">
          <div className="flex flex-col">
            <span className="font-semibold text-[16px] font-sans">
              Property & Room
            </span>
          </div>
        </TableHead>

        <TableHead className="text-center w-[160px]">
          <div className="flex flex-col">
            <span className="font-semibold text-[16px] font-sans">
              Booking Details
            </span>
          </div>
        </TableHead>

        <TableHead className="text-center w-[150px]">
          <div className="flex flex-col">
            <span className="font-semibold text-[16px] font-sans">
              Payment Info
            </span>
          </div>
        </TableHead>

        <TableHead className="text-center w-[120px]">
          <div className="flex flex-col">
            <span className="font-semibold text-[16px] font-sans">Status</span>
          </div>
        </TableHead>

        <TableHead className="text-center w-[200px]">
          <div className="flex flex-col">
            <span className="font-semibold text-[16px] font-sans">Actions</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
