import type { PriceAdjustType, PriceAdjustment } from "@/types/room";

export interface PriceAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  roomName: string;
  basePrice: number;
}

export interface FormData {
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  adjustType: PriceAdjustType;
  adjustValue: string;
  dateMode: "range" | "specific";
  specificDates: Date[];
}

export type { PriceAdjustType, PriceAdjustment };
