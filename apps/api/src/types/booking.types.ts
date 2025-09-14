export interface BookingStatusUpdate {
  expiredCount?: number;
  confirmedCount?: number;
  completedCount?: number;
  canceledCount?: number;
  bookings: BookingUpdateResult[];
}

export interface BookingUpdateResult {
  id: string;
  orderCode: string;
  userEmail?: string | null;
  propertyName?: string | null;
  roomName?: string | null;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  expiresAt?: Date | null;
}

export interface CronJobConfig {
  name: string;
  schedule: string;
  enabled: boolean;
  description: string;
}
