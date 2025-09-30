"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReviewForm } from "./review-form";
import type { CreateReviewInput } from "@/types/review";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  propertyName: string;
  onSubmit: (data: CreateReviewInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function ReviewDialog({
  open,
  onOpenChange,
  bookingId,
  propertyName,
  onSubmit,
  isSubmitting = false,
}: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <ReviewForm
          bookingId={bookingId}
          propertyName={propertyName}
          onSubmit={async (data) => {
            await onSubmit(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}