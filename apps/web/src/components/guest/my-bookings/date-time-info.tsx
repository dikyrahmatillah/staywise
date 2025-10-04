import { format } from "date-fns";

interface DateTimeInfoProps {
  createdAt: Date;
}

export const DateTimeInfo = ({ createdAt }: DateTimeInfoProps) => {
  const date = new Date(createdAt);

  return (
    <div className="flex flex-col gap-1 items-center">
      <p className="text-sm font-sans font-medium whitespace-nowrap">
        {format(date, "MMM dd, yyyy")}
      </p>
      <p className="text-sm font-sans text-muted-foreground whitespace-nowrap">
        {format(date, "hh:mm a")}
      </p>
    </div>
  );
};
