import { formatCurrency } from "@/lib/booking-formatters";

interface BankTransferDetailsProps {
  orderCode: string;
  totalAmount?: number;
}

export function BankTransferDetails({
  orderCode,
  totalAmount,
}: BankTransferDetailsProps) {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-sm font-sans text-blue-800 font-medium mb-2">
        Bank Transfer Details:
      </p>
      <div className="text-sm font-sans text-blue-700 space-y-1">
        <p>Bank: BCA</p>
        <p>Account: 1234567890</p>
        <p>Name: StayWise Property</p>
        {totalAmount && <p>Amount: {formatCurrency(totalAmount)}</p>}
        <p>Reference: {orderCode}</p>
      </div>
    </div>
  );
}