// Internal API-only types that don't need to be shared

import type { 
  CreateBookingInput,
  BookingValidationData
} from "@repo/types";
import type { BookingPaymentMethod } from "@repo/database/generated/prisma/index.js";

// Internal booking creation data with additional processing fields
export interface BookingCreationData
  extends Omit<CreateBookingInput, "checkIn" | "checkOut"> {
  checkIn: string | Date;
  checkOut: string | Date;
  paymentMethod?: BookingPaymentMethod;
}

// In your types file
export interface BookingFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userId?: string;
  tenantId?: string;
  propertyId?: string;
  includeExpired?: boolean;
}

// Cron job configuration (API internal)
export interface CronJobConfig {
  name: string;
  schedule: string;
  enabled: boolean;
  description: string;
}