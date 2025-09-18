import { Request, Response, NextFunction } from "express";
import { paymentProofService } from "@/services/payment-proof.service.js";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export class PaymentProofController {
  async uploadPaymentProof(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;
      const file = req.file;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "Payment proof image is required",
        });
      }

      const paymentProof = await paymentProofService.uploadPaymentProof(
        orderId,
        userId,
        file 
      );

      res.status(201).json({
        success: true,
        message: "Payment proof uploaded successfully",
        data: paymentProof,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentProof(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const paymentProof = await paymentProofService.getPaymentProof(
        orderId,
        userId
      );

      res.json({
        success: true,
        data: paymentProof,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePaymentProof(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      await paymentProofService.deletePaymentProof(orderId, userId);

      res.json({
        success: true,
        message: "Payment proof deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentProofController = new PaymentProofController();
