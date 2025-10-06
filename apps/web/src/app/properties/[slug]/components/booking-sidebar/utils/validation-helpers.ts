import { normalizeDateToMidnight, formatConflictDate } from "./date-formatters";

export interface DateRangeOverlapResult {
  hasOverlap: boolean;
  conflictDates: string[];
}

/**
 * Check if a date is disabled (past or unavailable)
 */
export const isDateDisabled = (
  date: Date,
  unavailableDates: Date[]
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Disable past dates
  if (date < today) return true;

  // Disable unavailable dates from bookings
  const isUnavailable = unavailableDates.some((unavailableDate) => {
    const unavailableDay = normalizeDateToMidnight(unavailableDate);
    const currentDay = normalizeDateToMidnight(date);
    return unavailableDay.getTime() === currentDay.getTime();
  });

  return isUnavailable;
};

/**
 * Check if checkout date is disabled
 */
export const isCheckoutDisabled = (
  date: Date,
  unavailableDates: Date[],
  checkInDate: Date | undefined
): boolean => {
  if (isDateDisabled(date, unavailableDates)) return true;

  // If check-in is selected, disable dates before or equal to check-in
  if (checkInDate) {
    return date <= checkInDate;
  }

  return false;
};

/**
 * Check if a date range overlaps with any booked dates
 */
export const checkRangeOverlap = (
  startDate: Date,
  endDate: Date,
  unavailableDates: Date[]
): DateRangeOverlapResult => {
  const conflicts: string[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current < end) {
    const isConflict = unavailableDates.some((unavailableDate) => {
      const unavailableDay = normalizeDateToMidnight(unavailableDate);
      return current.getTime() === unavailableDay.getTime();
    });

    if (isConflict) {
      conflicts.push(formatConflictDate(current));
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    hasOverlap: conflicts.length > 0,
    conflictDates: conflicts,
  };
};