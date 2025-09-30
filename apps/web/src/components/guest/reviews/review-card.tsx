"use client";

import { Star, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Review } from "@/types/review";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: Review;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReviewCard({
  review,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const userInitials = review.User
    ? `${review.User.firstName[0]}${review.User.lastName?.[0] || ""}`
    : "U";

  const userName = review.User
    ? `${review.User.firstName} ${review.User.lastName || ""}`.trim()
    : "Anonymous";

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.User?.image || undefined} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {canDelete && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
      </div>

      <p className="text-sm leading-relaxed">{review.comment}</p>

      {review.Property && (
        <p className="text-xs text-muted-foreground">
          Property: {review.Property.name}
        </p>
      )}
    </div>
  );
}