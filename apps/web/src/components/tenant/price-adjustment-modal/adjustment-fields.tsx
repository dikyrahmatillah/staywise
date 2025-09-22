"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Percent } from "lucide-react";
import type { PriceAdjustType } from "./types";

interface Props {
  basePrice: number;
  adjustType: PriceAdjustType;
  adjustValue: string;
  submitting?: boolean;
  onChangeType: (v: PriceAdjustType) => void;
  onChangeValue: (v: string) => void;
  calcAdjustedPrice: (
    base: number,
    type: PriceAdjustType,
    value: number
  ) => number;
  formatIdr: (n: number) => string;
}

export default function AdjustmentFields({
  basePrice,
  adjustType,
  adjustValue,
  onChangeType,
  onChangeValue,
  calcAdjustedPrice,
  formatIdr,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="mb-1">Adjustment Type</Label>
        <Select
          value={adjustType}
          onValueChange={(v: PriceAdjustType) => onChangeType(v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Percentage
              </div>
            </SelectItem>
            <SelectItem value="NOMINAL">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Fixed Amount
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1">
          Adjustment Value {adjustType === "PERCENTAGE" ? "(%)" : "(IDR)"}
        </Label>
        <Input
          type="number"
          step="1"
          value={adjustValue}
          onChange={(e) => onChangeValue(e.target.value)}
          placeholder={adjustType === "PERCENTAGE" ? "10" : "50000"}
        />
        {adjustValue && (
          <p className="text-sm text-muted-foreground mt-1">
            Adjusted price:{" "}
            {formatIdr(
              calcAdjustedPrice(
                basePrice,
                adjustType,
                parseFloat(adjustValue) || 0
              )
            )}
          </p>
        )}
      </div>
    </div>
  );
}
