// apps/web/src/hooks/useBookingTimer.ts
"use client";

import { useState, useEffect, useCallback } from "react";

interface UseBookingTimerProps {
  expiresAt: Date | null;
  onExpire?: () => void;
  autoCancel?: boolean;
}

interface UseBookingTimerReturn {
  timeLeft: number;
  isExpired: boolean;
  timeFormatted: string;
  percentageLeft: number;
  isUrgent: boolean; // Less than 10 minutes
  isWarning: boolean; // Less than 30 minutes
}

export const useBookingTimer = ({
  expiresAt,
  onExpire,
  autoCancel = true,
}: UseBookingTimerProps): UseBookingTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (!expiresAt) return 0;

    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const difference = expiry - now;

    if (difference <= 0) {
      if (!isExpired && autoCancel) {
        setIsExpired(true);
        onExpire?.();
      }
      return 0;
    }

    return difference;
  }, [expiresAt, isExpired, autoCancel, onExpire]);

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(0);
      return;
    }

    // Initial calculation
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);

    // Set up interval for countdown
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, calculateTimeLeft]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculatePercentage = (milliseconds: number): number => {
    if (!expiresAt) return 0;
    
    const totalDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    const percentage = (milliseconds / totalDuration) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  return {
    timeLeft,
    isExpired,
    timeFormatted: formatTime(timeLeft),
    percentageLeft: calculatePercentage(timeLeft),
    isUrgent: timeLeft < 10 * 60 * 1000 && timeLeft > 0, // Less than 10 minutes
    isWarning: timeLeft < 30 * 60 * 1000 && timeLeft > 0, // Less than 30 minutes
  };
};