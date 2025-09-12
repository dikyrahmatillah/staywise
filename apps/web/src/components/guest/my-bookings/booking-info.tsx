import { formatDate } from "@/lib/booking-formatters";

interface BookingInfoProps {
  orderCode: string;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
}

export const BookingInfo = ({
  orderCode,
  checkInDate,
  checkOutDate,
  nights,
}: BookingInfoProps) => {
  return (
    <div>
      <div className="text-sm font-medium">{orderCode}</div>
      <div className="text-xs text-muted-foreground">
        {formatDate(checkInDate)} - {formatDate(checkOutDate)}
      </div>
      <div className="text-xs text-muted-foreground">{nights} nights</div>
    </div>
  );
};
