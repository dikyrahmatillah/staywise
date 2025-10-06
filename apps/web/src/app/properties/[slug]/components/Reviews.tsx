"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import type { ReviewItem } from "@/types/property-detail";

export function Reviews({
  reviews,
  total,
}: {
  reviews: ReviewItem[];
  total: number;
}) {
  const [showAll, setShowAll] = useState(false);

  if (!reviews || reviews.length === 0 || total === 0) return null;

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section id="reviews">
      <h3 className="font-display text-xl font-semibold mb-6">Reviews</h3>
      <div className="space-y-6">
        {visibleReviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={review.avatar} alt={review.author} />
                <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{review.author}</span>
                  <div className="flex items-center">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {(() => {
                      const d = parseISO(review.date);
                      return format(d, "yyyy-MM-dd");
                    })()}
                  </span>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}

        {reviews.length > 3 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll ? "Show less" : `Show all ${total} reviews`}
          </Button>
        )}
      </div>
    </section>
  );
}
