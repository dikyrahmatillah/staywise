import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OrderStatus, StatusConfig, BadgeVariant } from "@repo/types";
import { statusTooltips, type StatusTooltipContent } from "@/components/guest/my-bookings/status-tooltips";

const statusConfigs: Record<
  OrderStatus,
  StatusConfig & { variant: BadgeVariant }
> = {
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
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    dot: "bg-purple-500",
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

const defaultConfig = {
  variant: "secondary" as BadgeVariant,
  className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  dot: "bg-gray-500",
  label: "Unknown Status",
};

interface StatusBadgeProps {
  status: OrderStatus;
  tooltips?: Record<OrderStatus, StatusTooltipContent>;
}

export const StatusBadge = ({ status, tooltips }: StatusBadgeProps) => {
  const config = statusConfigs[status] || defaultConfig;
  const tooltipSource = tooltips || statusTooltips;
  const tooltipContent = tooltipSource[status];

  if (!statusConfigs[status]) {
    console.warn("StatusBadge received invalid status:", status);
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={config.variant}
            className={`${config.className} cursor-help`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot} mr-1.5`} />
            {config.label}
          </Badge>
        </TooltipTrigger>
        {tooltipContent && (
          <TooltipContent className="flex flex-wrap max-w-[200px]">
            <p className="text-sm font-sans text-white">
              {tooltipContent.description}
            </p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
