export interface Review {
  id: number;
  userName: string;
  userAvatar?: string;
  timeAgo: string;
  rating: number;
  reviewText: string;
  fullReview: string;
}

export interface ReviewData {
  overallRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  reviews: Review[];
}

export interface ReviewCardProps {
  review: Review;
}

export interface ReviewSectionProps {
  data: ReviewData;
}
