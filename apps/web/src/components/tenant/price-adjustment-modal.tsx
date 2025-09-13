"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  CalendarIcon,
  Plus,
  X,
  Edit,
  Trash2,
  DollarSign,
  Percent,
} from "lucide-react";
import { format } from "date-fns";
import type {
  PriceAdjustment,
  PriceAdjustType,
  CreatePriceAdjustmentRequest,
} from "@/types/room";
import { usePriceAdjustments } from "@/hooks/usePriceAdjustments";

interface PriceAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  roomName: string;
  basePrice: number;
}

interface FormData {
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  adjustType: PriceAdjustType;
  adjustValue: string;
  dateMode: "range" | "specific";
  specificDates: Date[];
}

export function PriceAdjustmentModal({
  open,
  onOpenChange,
  roomId,
  roomName,
  basePrice,
}: PriceAdjustmentModalProps) {
  const {
    priceAdjustments,
    loading,
    fetchPriceAdjustments,
    createPriceAdjustment,
    updatePriceAdjustment,
    deletePriceAdjustment,
  } = usePriceAdjustments(roomId);

  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAdjustment, setEditingAdjustment] =
    useState<PriceAdjustment | null>(null);
  const [deleteAdjustmentId, setDeleteAdjustmentId] = useState<string | null>(
    null
  );

  const [formData, setFormData] = useState<FormData>({
    title: "",
    startDate: undefined,
    endDate: undefined,
    adjustType: "PERCENTAGE",
    adjustValue: "",
    dateMode: "range",
    specificDates: [],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      startDate: undefined,
      endDate: undefined,
      adjustType: "PERCENTAGE",
      adjustValue: "",
      dateMode: "range",
      specificDates: [],
    });
    setEditingAdjustment(null);
    setShowForm(false);
  };

  useEffect(() => {
    if (open && roomId) {
      fetchPriceAdjustments();
    }
  }, [open, roomId, fetchPriceAdjustments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setSubmitting(true);
    try {
      const payload: CreatePriceAdjustmentRequest = {
        title: formData.title || undefined,
        startDate:
          formData.dateMode === "range" && formData.startDate
            ? format(formData.startDate, "yyyy-MM-dd")
            : formData.specificDates.length > 0
            ? format(formData.specificDates[0], "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
        endDate:
          formData.dateMode === "range" && formData.endDate
            ? format(formData.endDate, "yyyy-MM-dd")
            : formData.specificDates.length > 0
            ? format(
                formData.specificDates[formData.specificDates.length - 1],
                "yyyy-MM-dd"
              )
            : format(new Date(), "yyyy-MM-dd"),
        adjustType: formData.adjustType,
        adjustValue: parseFloat(formData.adjustValue),
        applyAllDates: formData.dateMode === "range",
        dates:
          formData.dateMode === "specific"
            ? formData.specificDates.map((date) => format(date, "yyyy-MM-dd"))
            : undefined,
      };

      if (editingAdjustment) {
        await updatePriceAdjustment(editingAdjustment.id, payload);
      } else {
        await createPriceAdjustment(payload);
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save price adjustment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (adjustment: PriceAdjustment) => {
    setFormData({
      title: adjustment.title || "",
      startDate: new Date(adjustment.startDate),
      endDate: new Date(adjustment.endDate),
      adjustType: adjustment.adjustType,
      adjustValue: adjustment.adjustValue.toString(),
      dateMode: adjustment.applyAllDates ? "range" : "specific",
      specificDates: adjustment.Dates?.map((d) => new Date(d.date)) || [],
    });
    setEditingAdjustment(adjustment);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteAdjustmentId) return;

    try {
      await deletePriceAdjustment(deleteAdjustmentId);
      setDeleteAdjustmentId(null);
    } catch (error) {
      console.error("Failed to delete price adjustment:", error);
    }
  };

  const calculateAdjustedPrice = (
    adjustType: PriceAdjustType,
    adjustValue: number
  ) => {
    if (adjustType === "PERCENTAGE") {
      return basePrice * (1 + adjustValue / 100);
    } else {
      return basePrice + adjustValue;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const addSpecificDate = (date: Date) => {
    if (
      !formData.specificDates.find(
        (d) => d.toDateString() === date.toDateString()
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        specificDates: [...prev.specificDates, date],
      }));
    }
  };

  const removeSpecificDate = (dateToRemove: Date) => {
    setFormData((prev) => ({
      ...prev,
      specificDates: prev.specificDates.filter(
        (d) => d.toDateString() !== dateToRemove.toDateString()
      ),
    }));
  };

  const isFormValid = () => {
    if (!formData.adjustValue) return false;

    if (formData.dateMode === "range") {
      return formData.startDate && formData.endDate;
    } else {
      return formData.specificDates.length > 0;
    }
  };

  const getValidationMessage = () => {
    if (!formData.adjustValue) return "Please enter an adjustment value";

    if (formData.dateMode === "range") {
      if (!formData.startDate || !formData.endDate) {
        return "Please select both start and end dates";
      }
    } else {
      if (formData.specificDates.length === 0) {
        return "Please select at least one specific date";
      }
    }

    return null;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Price Adjustments - {roomName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Base Price</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(basePrice)}
                  </p>
                </div>
                <Button onClick={() => setShowForm(true)} disabled={showForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Price Adjustment
                </Button>
              </div>
            </div>

            {showForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingAdjustment ? "Edit" : "Create"} Price Adjustment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title (Optional)</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="e.g., Holiday Weekend, Long Weekend"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Adjustment Type</Label>
                        <Select
                          value={formData.adjustType}
                          onValueChange={(value: PriceAdjustType) =>
                            setFormData((prev) => ({
                              ...prev,
                              adjustType: value,
                            }))
                          }
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
                        <Label>
                          Adjustment Value
                          {formData.adjustType === "PERCENTAGE"
                            ? " (%)"
                            : " (IDR)"}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.adjustValue}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              adjustValue: e.target.value,
                            }))
                          }
                          placeholder={
                            formData.adjustType === "PERCENTAGE"
                              ? "10"
                              : "50000"
                          }
                        />
                        {formData.adjustValue && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Adjusted price:{" "}
                            {formatPrice(
                              calculateAdjustedPrice(
                                formData.adjustType,
                                parseFloat(formData.adjustValue) || 0
                              )
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Date Selection Mode</Label>
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="dateMode-range"
                              name="dateMode"
                              checked={formData.dateMode === "range"}
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  dateMode: "range",
                                }))
                              }
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <div className="flex flex-col">
                              <Label htmlFor="dateMode-range">Date Range</Label>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="dateMode-specific"
                              name="dateMode"
                              checked={formData.dateMode === "specific"}
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  dateMode: "specific",
                                }))
                              }
                              className="h-4 w-4 text-primary focus:ring-primary"
                            />
                            <div className="flex flex-col">
                              <Label htmlFor="dateMode-specific">
                                Specific Dates
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {formData.dateMode === "range" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.startDate
                                    ? format(formData.startDate, "PPP")
                                    : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.startDate}
                                  onSelect={(date) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      startDate: date,
                                    }))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Label>End Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.endDate
                                    ? format(formData.endDate, "PPP")
                                    : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={formData.endDate}
                                  onSelect={(date) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      endDate: date,
                                    }))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      )}

                      {formData.dateMode === "specific" && (
                        <div className="space-y-2">
                          <div className="flex gap-2 flex-wrap">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Date
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  onSelect={(date) =>
                                    date && addSpecificDate(date)
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.specificDates.map((date, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {format(date, "MMM dd")}
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                                  onClick={() => removeSpecificDate(date)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                      {!isFormValid() && (
                        <p className="text-sm text-red-600">
                          {getValidationMessage()}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={submitting || !isFormValid()}
                        >
                          {submitting
                            ? "Saving..."
                            : editingAdjustment
                            ? "Update"
                            : "Create"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Existing Price Adjustments
              </h3>
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
              ) : priceAdjustments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No price adjustments yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {priceAdjustments.map((adjustment) => (
                    <Card key={adjustment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {adjustment.title && (
                                <h4 className="font-medium">
                                  {adjustment.title}
                                </h4>
                              )}
                              <Badge
                                variant={
                                  adjustment.adjustType === "PERCENTAGE"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {adjustment.adjustType === "PERCENTAGE" ? (
                                  <>
                                    <Percent className="h-3 w-3 mr-1" />{" "}
                                    {adjustment.adjustValue}%
                                  </>
                                ) : (
                                  <>
                                    <DollarSign className="h-3 w-3 mr-1" />{" "}
                                    {formatPrice(adjustment.adjustValue)}
                                  </>
                                )}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(
                                new Date(adjustment.startDate),
                                "MMM dd, yyyy"
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(adjustment.endDate),
                                "MMM dd, yyyy"
                              )}
                            </p>
                            <p className="text-sm">
                              Adjusted Price:{" "}
                              <span className="font-semibold text-green-600">
                                {formatPrice(
                                  calculateAdjustedPrice(
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
                              onClick={() => handleEdit(adjustment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setDeleteAdjustmentId(adjustment.id)
                              }
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
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteAdjustmentId}
        onOpenChange={() => setDeleteAdjustmentId(null)}
      >
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
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
