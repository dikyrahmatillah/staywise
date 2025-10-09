import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, AlertCircle } from "lucide-react";
import { useBookingTimer } from "@/hooks/useBookingTimer";

interface ExpirationTimerProps {
  expiresAt: Date | null;
  onExpire?: () => void;
}

export function ExpirationTimer({ expiresAt, onExpire }: ExpirationTimerProps) {
  const { timeFormatted, isExpired, isUrgent, isWarning } = useBookingTimer({
    expiresAt,
    onExpire,
    autoCancel: true,
  });

  // Don't show if no expiration
  if (!expiresAt) return null;

  // Expired state
  if (isExpired) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="font-sans">
          ❌ Upload time has expired. This booking has been cancelled.
        </AlertDescription>
      </Alert>
    );
  }

  // Active timer
  return (
    <Alert
      variant={isUrgent ? "destructive" : isWarning ? "default" : "default"}
      className={
        isUrgent
          ? "bg-red-50 border-red-200"
          : isWarning
          ? "bg-amber-50 border-amber-200"
          : "bg-blue-50 border-blue-200"
      }
    >
      <Clock className="h-4 w-4" />
      <AlertDescription>
        {isUrgent ? (
          <span className="font-semibold font-sans text-red-700">
            ⚠️ Upload expires in: {timeFormatted}
          </span>
        ) : (
          <span
            className={
              isWarning
                ? "font-sans text-amber-700"
                : "font-sans text-blue-700"
            }
          >
            ⏱️ Upload before: {timeFormatted}
          </span>
        )}
      </AlertDescription>
    </Alert>
  );
}
