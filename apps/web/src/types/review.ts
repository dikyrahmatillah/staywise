export interface Review {
  id: string;
  orderId: string;
  userId: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;
  User?: {
    firstName: string;
    lastName: string | null;
    image: string | null;
  };
  Property?: {
    name: string;
    slug: string;
  };
}

export interface CreateReviewInput {
  orderId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CanReviewResponse {
  canReview: boolean;
  reason?: string;
}