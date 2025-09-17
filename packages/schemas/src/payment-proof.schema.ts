import { z } from "zod";

export const UploadPaymentProofSchema = z.object({
  orderId: z.string().uuid("Invalid order ID format"),
});

export const PaymentProofParamsSchema = z.object({
  orderId: z.string().uuid("Invalid order ID format"),
});

export const PaymentProofResponseSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  uploadedBy: z.string(),
  imageUrl: z.string(),
  uploadedAt: z.date(),
  acceptedAt: z.date().nullable(),
  rejectedAt: z.date().nullable(),
  reviewedBy: z.string().nullable(),
});

export type UploadPaymentProofInput = z.infer<typeof UploadPaymentProofSchema>;
export type PaymentProofParams = z.infer<typeof PaymentProofParamsSchema>;
export type PaymentProofResponse = z.infer<typeof PaymentProofResponseSchema>;
