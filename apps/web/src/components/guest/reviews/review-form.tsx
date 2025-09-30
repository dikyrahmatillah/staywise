// apps/web/src/components/reviews/review-form.tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CreateReviewInput } from "@/types/review";

interface ReviewFormProps {
  bookingId: string;
  propertyName: string;
  onSubmit: (data: CreateReviewInput) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ReviewForm({
  bookingId,
  propertyName,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters";
    }

    if (comment.trim().length > 1000) {
      newErrors.comment = "Review must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      orderId: bookingId,
      rating,
      comment: comment.trim(),
    });

    // Reset form on successful submission
    setRating(0);
    setComment("");
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Rate your stay at {propertyName}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Share your experience to help other travelers
        </p>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label htmlFor="rating">Rating *</Label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              {rating} {rating === 1 ? "star" : "stars"}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="text-sm text-destructive">{errors.rating}</p>
        )}
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="comment">Your Review *</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience..."
          rows={6}
          className={errors.comment ? "border-destructive" : ""}
        />
        <div className="flex justify-between text-sm">
          <p className={errors.comment ? "text-destructive" : "text-muted-foreground"}>
            {errors.comment || "Minimum 10 characters"}
          </p>
          <p className="text-muted-foreground">
            {comment.length}/1000
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}