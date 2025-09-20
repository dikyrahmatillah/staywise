import { startOfToday, startOfDay, format } from "date-fns";
import type { PriceAdjustType } from "./types";

export const today = startOfToday();

export const calcAdjustedPrice = (
  basePrice: number,
  adjustType: PriceAdjustType,
  adjustValue: number
) => {
  const base = Number(basePrice) || 0;
  const adj = Number(adjustValue) || 0;

  if (adjustType === "PERCENTAGE") return base * (1 + adj / 100);
  return base + adj;
};

export const formatIdr = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

export const addDateIfValid = (dates: Date[], date: Date): Date[] => {
  if (startOfDay(date) < today) return dates;
  const exists = dates.find((d) => d.toDateString() === date.toDateString());
  if (exists) return dates;
  return [...dates, date];
};

export const removeDate = (dates: Date[], dateToRemove: Date): Date[] =>
  dates.filter((d) => d.toDateString() !== dateToRemove.toDateString());

export const isFormValid = (args: {
  adjustValue: string;
  dateMode: "range" | "specific";
  startDate?: Date;
  endDate?: Date;
  specificDates: Date[];
}) => {
  const { adjustValue, dateMode, startDate, endDate, specificDates } = args;
  if (!adjustValue) return false;

  if (dateMode === "range") {
    if (!startDate || !endDate) return false;
    if (startOfDay(startDate) < today) return false;
    if (startOfDay(endDate) < today) return false;
    if (startOfDay(startDate) > startOfDay(endDate)) return false;
    return true;
  }

  if (specificDates.length === 0) return false;
  if (specificDates.some((d) => startOfDay(d) < today)) return false;
  return true;
};

export const getValidationMessage = (args: {
  adjustValue: string;
  dateMode: "range" | "specific";
  startDate?: Date;
  endDate?: Date;
  specificDates: Date[];
}): string | null => {
  const { adjustValue, dateMode, startDate, endDate, specificDates } = args;
  if (!adjustValue) return "Please enter an adjustment value";

  if (dateMode === "range") {
    if (!startDate || !endDate) return "Please select both start and end dates";

    if (startOfDay(startDate) < today || startOfDay(endDate) < today)
      return "Selected dates cannot be in the past";

    if (startOfDay(startDate) > startOfDay(endDate))
      return "Start date cannot be after end date";
  } else {
    if (specificDates.length === 0)
      return "Please select at least one specific date";
    if (specificDates.some((d) => startOfDay(d) < today))
      return "Selected dates cannot be in the past";
  }

  return null;
};

export const toRequestPayload = (args: {
  title: string;
  dateMode: "range" | "specific";
  startDate?: Date;
  endDate?: Date;
  specificDates: Date[];
  adjustType: PriceAdjustType;
  adjustValue: number;
}) => {
  const {
    title,
    dateMode,
    startDate,
    endDate,
    specificDates,
    adjustType,
    adjustValue,
  } = args;

  return {
    title: title || undefined,
    startDate:
      dateMode === "range" && startDate
        ? format(startDate, "yyyy-MM-dd")
        : specificDates.length > 0
        ? format(specificDates[0], "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    endDate:
      dateMode === "range" && endDate
        ? format(endDate, "yyyy-MM-dd")
        : specificDates.length > 0
        ? format(specificDates[specificDates.length - 1], "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    adjustType,
    adjustValue,
    applyAllDates: dateMode === "range",
    dates:
      dateMode === "specific"
        ? specificDates.map((d) => format(d, "yyyy-MM-dd"))
        : undefined,
  } as const;
};
