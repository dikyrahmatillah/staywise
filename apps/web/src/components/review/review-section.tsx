import { ReviewCard } from "./review-card";
import { ReviewSectionProps } from "@/components/review/types";

export function ReviewSection({ data }: ReviewSectionProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6 space-y-6">
        {data.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
