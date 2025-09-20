import { BookingCronService } from "./cron/booking-cron.service.js";
import { BookingCoreService } from "@/services/booking/core/booking-core.js";
import { BookingManagementService } from "@/services/booking/core/booking-management.service.js";
import { BookingUtilsService } from "@/services/booking/core/booking-utils.service.js";
import type {
  BookingFilters,
  AvailabilityCheckParams,
  BookingTotals,
  CreateBookingInput,
} from "@repo/types";
import type { BookingCreationData } from "@/services/booking/types/booking-internal.type.js";
import type { BookingValidationResult } from "@repo/schemas";
import type {
  BookingPaymentMethod,
  OrderStatus,
} from "@repo/database/generated/prisma/index.js";
import { prisma } from "@repo/database";
import { snap } from "@/configs/midtrans.config.js";

export class BookingService {
  private cronService: BookingCronService;
  private coreService: BookingCoreService;
  private managementService: BookingManagementService;
  private utilsService: BookingUtilsService;

  constructor() {
    this.cronService = new BookingCronService();
    this.coreService = new BookingCoreService();
    this.managementService = new BookingManagementService();
    this.utilsService = new BookingUtilsService();
  }

async createBooking(data: {
  userId: string;
  propertyId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  paymentMethod: BookingPaymentMethod;
}) {
  // Fetch room and property data to get basePrice and tenantId
  const room = await prisma.room.findUnique({
    where: { id: data.roomId },
    select: { 
      basePrice: true,
      Property: {
        select: { tenantId: true }
      }
    }
  });

  if (!room) {
    throw new Error(`Room with id ${data.roomId} not found`);
  }

  // Calculate booking details
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  // Convert Decimal to number and calculate total
  const pricePerNight = Number(room.basePrice);
  const totalAmount = pricePerNight * nights;

  // Generate unique order code
  const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // create booking in DB
  const booking = await prisma.booking.create({
    data: {
      userId: data.userId,
      propertyId: data.propertyId,
      roomId: data.roomId,
      tenantId: room.Property.tenantId, // Required field
      orderCode: orderCode, // Required field
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights: nights, // Required field
      pricePerNight: pricePerNight, // Required field
      totalAmount: totalAmount, // Required field
      paymentMethod: data.paymentMethod,
      status:
        data.paymentMethod === "PAYMENT_GATEWAY"
          ? "PROCESSING" // Check your OrderStatus enum for correct value
          : "COMPLETED", // Check your OrderStatus enum for correct value
    },
  });

  // if payment via Midtrans → create Snap transaction
  if (data.paymentMethod === "PAYMENT_GATEWAY") {
    const orderId = `ORD-${booking.id}-${Date.now()}`;
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount, // Using calculated total amount
      },
      // Removed customer_details - check Midtrans docs for correct structure
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        orderId,
        snapToken: transaction.token,
      },
    });

    return { ...booking, snapToken: transaction.token };
  }

  return booking;
}

  async checkRoomAvailability(
    propertyId: string,
    roomId: string,
    checkInDate: string,
    checkOutDate: string
  ) {
    return this.coreService.checkRoomAvailability(
      propertyId,
      roomId,
      checkInDate,
      checkOutDate
    );
  }

  async checkAvailabilityWithValidation(params: AvailabilityCheckParams) {
    return this.coreService.checkAvailabilityWithValidation(params);
  }

  // Management operations
  async getAllBookings() {
    return this.managementService.getAllBookings();
  }

  async getBookings(filters: BookingFilters = {}) {
    return this.managementService.getBookings(filters);
  }

  async getBookingById(id: string) {
    return this.managementService.getBookingById(id);
  }

  async cancelBooking(id: string) {
    return this.managementService.cancelBooking(id);
  }

  async verifyTenantPropertyAccess(tenantId: string, propertyId: string) {
    return this.managementService.verifyTenantPropertyAccess(
      tenantId,
      propertyId
    );
  }

  async updateBookingStatus(id: string, status: OrderStatus) {
    return this.managementService.updateBookingStatus(id, status);
  }

  async getBookingsByUser(userId: string) {
    return this.managementService.getBookingsByUser(userId);
  }

  async getBookingsByTenant(tenantId: string) {
    return this.managementService.getBookingsByTenant(tenantId);
  }

  async getBookingsByProperty(propertyId: string) {
    return this.managementService.getBookingsByProperty(propertyId);
  }

  async getActiveBookings() {
    return this.managementService.getActiveBookings();
  }

  async getPendingBookings() {
    return this.managementService.getPendingBookings();
  }

  // Utility operations
  async validateBookingData(data: {
    checkInDate: Date;
    checkOutDate: Date;
    adults?: number;
    children?: number;
    pets?: number;
    propertyId: string;
    pricePerNight: number;
  }): Promise<BookingValidationResult> {
    return this.utilsService.validateBookingData(data);
  }

  calculateBookingTotals(
    checkInDate: Date,
    checkOutDate: Date,
    pricePerNight: number
  ): BookingTotals {
    return this.utilsService.calculateBookingTotals(
      checkInDate,
      checkOutDate,
      pricePerNight
    );
  }

  // Cron job management
  startAllCronJobs(): void {
    this.cronService.startAllJobs();
  }

  stopAllCronJobs(): void {
    this.cronService.stopAllJobs();
  }

  getCronJobsStatus() {
    return this.cronService.getJobsStatus();
  }

  // Manual execution methods for testing
  async runAllMaintenanceTasks() {
    return this.cronService.runAllMaintenanceTasks();
  }

  async runExpirationTask() {
    return this.cronService.runExpirationJob();
  }

  shutdown(): void {
    this.cronService.shutdown();
  }
}

export const bookingService = new BookingService();
