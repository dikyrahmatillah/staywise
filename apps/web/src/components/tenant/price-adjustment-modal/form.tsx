"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FormData, PriceAdjustType } from "./types";
import {
  calcAdjustedPrice,
  formatIdr,
  getValidationMessage,
  isFormValid,
} from "./utils";
import AdjustmentFields from "./adjustment-fields";
import DateSelection from "./date-selection";

interface PriceAdjustmentFormProps {
  basePrice: number;
  defaultData: FormData;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  title?: string;
}

export function PriceAdjustmentForm({
  basePrice,
  defaultData,
  submitting,
  onCancel,
  onSubmit,
  title,
}: PriceAdjustmentFormProps) {
  const [formData, setFormData] = useState<FormData>(defaultData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !isFormValid({
        adjustValue: formData.adjustValue,
        dateMode: formData.dateMode,
        startDate: formData.startDate,
        endDate: formData.endDate,
        specificDates: formData.specificDates,
      })
    )
      return;

    await onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {title ?? "Create / Edit Price Adjustment"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-1">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="e.g., Holiday Weekend, Long Weekend"
            />
          </div>

          <AdjustmentFields
            basePrice={basePrice}
            adjustType={formData.adjustType}
            adjustValue={formData.adjustValue}
            onChangeType={(v: PriceAdjustType) =>
              setFormData((p) => ({ ...p, adjustType: v }))
            }
            onChangeValue={(v: string) =>
              setFormData((p) => ({ ...p, adjustValue: v }))
            }
            calcAdjustedPrice={calcAdjustedPrice}
            formatIdr={formatIdr}
          />

          <DateSelection
            data={formData}
            onChange={(patch) => setFormData((p) => ({ ...p, ...patch }))}
          />

          <div className="flex flex-col gap-2 pt-4">
            {!isFormValid({
              adjustValue: formData.adjustValue,
              dateMode: formData.dateMode,
              startDate: formData.startDate,
              endDate: formData.endDate,
              specificDates: formData.specificDates,
            }) && (
              <p className="text-sm text-red-600">
                {getValidationMessage({
                  adjustValue: formData.adjustValue,
                  dateMode: formData.dateMode,
                  startDate: formData.startDate,
                  endDate: formData.endDate,
                  specificDates: formData.specificDates,
                })}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={
                  submitting ||
                  !isFormValid({
                    adjustValue: formData.adjustValue,
                    dateMode: formData.dateMode,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    specificDates: formData.specificDates,
                  })
                }
              >
                {submitting ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
