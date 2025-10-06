import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";
import type {
  CreateReviewInput,
  UpdateReviewInput,
  GetReviewsQuery,
} from "../schemas/index.js";

export class ReviewService {
  async createReview(userId: string, data: CreateReviewInput) {
    // Verify booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: data.orderId },
      include: {
        review: true,
        Property: { select: { name: true } },
      },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (booking.userId !== userId) {
      throw new AppError("You can only review your own bookings", 403);
    }

    // Check if booking is completed
    if (booking.status !== "COMPLETED") {
      throw new AppError("You can only review completed bookings", 400);
    }

    // Check if checkout date has passed
    const now = new Date();
    if (booking.checkOutDate > now) {
      throw new AppError(
        "You can only leave a review after checkout date",
        400
      );
    }

    // Check if review already exists
    if (booking.review) {
      throw new AppError("You have already reviewed this booking", 400);
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        orderId: data.orderId,
        userId,
        propertyId: booking.propertyId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        Property: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return review;
  }

  async updateReview(
    userId: string,
    reviewId: string,
    data: UpdateReviewInput
  ) {
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      throw new AppError("Review not found", 404);
    }

    if (existingReview.userId !== userId) {
      throw new AppError("You can only update your own reviews", 403);
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.comment !== undefined && { comment: data.comment }),
      },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        Property: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return review;
  }

  async deleteReview(userId: string, reviewId: string) {
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      throw new AppError("Review not found", 404);
    }

    if (existingReview.userId !== userId) {
      throw new AppError("You can only delete your own reviews", 403);
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return { message: "Review deleted successfully" };
  }

  async getReviewByBookingId(bookingId: string) {
    const review = await prisma.review.findUnique({
      where: { orderId: bookingId },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        Property: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return review;
  }

  async getReviews(query: GetReviewsQuery) {
    const { page = 1, limit = 10, propertyId, userId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (userId) {
      where.userId = userId;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          User: {
            select: {
              firstName: true,
              lastName: true,
              image: true,
            },
          },
          Property: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPropertyReviewStats(propertyId: string) {
    const reviews = await prisma.review.findMany({
      where: { propertyId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution = reviews.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution: {
        5: ratingDistribution[5] || 0,
        4: ratingDistribution[4] || 0,
        3: ratingDistribution[3] || 0,
        2: ratingDistribution[2] || 0,
        1: ratingDistribution[1] || 0,
      },
    };
  }

  async canUserReviewBooking(
    userId: string,
    bookingId: string
  ): Promise<{
    canReview: boolean;
    reason?: string;
  }> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking) {
      return { canReview: false, reason: "Booking not found" };
    }

    if (booking.userId !== userId) {
      return { canReview: false, reason: "Not your booking" };
    }

    if (booking.status !== "COMPLETED") {
      return { canReview: false, reason: "Booking not completed" };
    }

    if (booking.checkOutDate > new Date()) {
      return { canReview: false, reason: "Checkout date not reached" };
    }

    if (booking.review) {
      return { canReview: false, reason: "Already reviewed" };
    }

    return { canReview: true };
  }
}

export const reviewService = new ReviewService();
