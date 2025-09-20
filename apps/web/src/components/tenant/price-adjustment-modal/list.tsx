"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Edit, Percent, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { PriceAdjustment } from "./types";
import { calcAdjustedPrice, formatIdr } from "./utils";

interface PriceAdjustmentListProps {
  basePrice: number;
  loading: boolean;
  items: PriceAdjustment[];
  onEdit: (item: PriceAdjustment) => void;
  onDelete: (id: string) => Promise<void>;
}

export function PriceAdjustmentList({
  basePrice,
  loading,
  items,
  onEdit,
  onDelete,
}: PriceAdjustmentListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Existing Price Adjustments</h3>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No price adjustments yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((adjustment) => (
            <Card key={adjustment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {adjustment.title && (
                        <h4 className="font-medium">{adjustment.title}</h4>
                      )}
                      <Badge
                        variant={
                          adjustment.adjustType === "PERCENTAGE"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {adjustment.adjustType === "PERCENTAGE" ? (
                          <>{adjustment.adjustValue}%</>
                        ) : (
                          <>{formatIdr(adjustment.adjustValue)}</>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(adjustment.startDate), "MMM dd, yyyy")} -{" "}
                      {format(new Date(adjustment.endDate), "MMM dd, yyyy")}
                    </p>
                    <p className="text-sm">
                      Adjusted Price:{" "}
                      <span className="font-semibold text-green-600">
                        {formatIdr(
                          calcAdjustedPrice(
                            basePrice,
                            adjustment.adjustType,
                            adjustment.adjustValue
                          )
                        )}
                      </span>
                    </p>
                    {!adjustment.applyAllDates && adjustment.Dates && (
                      <div className="flex gap-1 flex-wrap">
                        {adjustment.Dates.map((date) => (
                          <Badge
                            key={date.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {format(new Date(date.date), "MMM dd")}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(adjustment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(adjustment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Price Adjustment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this price adjustment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteId) {
                  await onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
