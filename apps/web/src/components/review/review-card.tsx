"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Review } from "@/components/review/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Image
          width={48}
          height={48}
          src={review.userAvatar || "/placeholder.svg"}
          alt={review.userName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 space-y-2">
          <div>
            <h4 className="font-semibold">{review.userName}</h4>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? "fill-current" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              {review.timeAgo}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-sans text-foreground leading-relaxed">
          {isExpanded ? review.fullReview : review.reviewText}
        </p>

        {review.reviewText !== review.fullReview && (
          <Button
            variant="link"
            className="p-0 h-auto font-sans font-semibold underline text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </div>
    </div>
  );
}
