import { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service.js";
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewsQuerySchema,
} from "../schemas/index.js";

export class ReviewController {
  async createReview(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = (request as any).user?.id;
      if (!userId) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const data = createReviewSchema.parse(request.body);
      const review = await reviewService.createReview(userId, data);

      response.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = (request as any).user?.id;
      if (!userId) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const { reviewId } = request.params;
      const data = updateReviewSchema.parse(request.body);
      const review = await reviewService.updateReview(userId, reviewId, data);

      response.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = (request as any).user?.id;
      if (!userId) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const { reviewId } = request.params;
      const result = await reviewService.deleteReview(userId, reviewId);

      response.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReviewByBooking(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { bookingId } = request.params;
      const review = await reviewService.getReviewByBookingId(bookingId);

      if (!review) {
        return response.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      response.status(200).json({
        success: true,
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReviews(request: Request, response: Response, next: NextFunction) {
    try {
      const query = getReviewsQuerySchema.parse(request.query);
      const result = await reviewService.getReviews(query);

      response.status(200).json({
        success: true,
        data: result.reviews,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPropertyReviewStats(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { propertyId } = request.params;
      const stats = await reviewService.getPropertyReviewStats(propertyId);

      response.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async canReviewBooking(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const userId = (request as any).user?.id;
      if (!userId) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const { bookingId } = request.params;
      const result = await reviewService.canUserReviewBooking(
        userId,
        bookingId
      );

      response.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
