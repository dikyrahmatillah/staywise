import { Badge } from "@/components/ui/badge";
import type { OrderStatus, StatusConfig } from "@/types/booking";

const statusConfigs: Record<OrderStatus, StatusConfig> = {
  WAITING_PAYMENT: {
    variant: "secondary",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    dot: "bg-yellow-500",
    label: "Waiting Payment",
  },
  WAITING_CONFIRMATION: {
    variant: "secondary",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    dot: "bg-blue-500",
    label: "Waiting Confirmation",
  },
  PROCESSING: {
    variant: "destructive",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
    dot: "bg-red-500",
    label: "Processing",
  },
  COMPLETED: {
    variant: "secondary",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
    dot: "bg-green-500",
    label: "Completed",
  },
  CANCELED: {
    variant: "secondary",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    dot: "bg-gray-500",
    label: "Canceled",
  },
  EXPIRED: {
    variant: "secondary",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    dot: "bg-orange-500",
    label: "Expired",
  },
};

const defaultConfig: StatusConfig = {
  variant: "secondary",
  className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  dot: "bg-gray-500",
  label: "Unknown Status",
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfigs[status] || defaultConfig;

  if (!statusConfigs[status]) {
    console.warn("StatusBadge received invalid status:", status);
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} mr-1.5`} />
      {config.label}
    </Badge>
  );
};
