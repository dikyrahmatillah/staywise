// apps/api/src/services/booking/booking.service.ts
import { BookingCronService } from "./cron/booking-cron.service.js";
import { BookingCoreService } from "./core/booking-core.js";
import { BookingManagementService } from "./core/booking-management.service.js";
import { BookingUtilsService } from "./core/booking-utils.service.js";
import type {
  BookingFilters,
  AvailabilityCheckParams,
  BookingTotals,
} from "../../types/booking.js";
import { faker } from "@faker-js/faker";
import type { BookingValidationResult } from "../../schemas/index.js";
import type { BookingPaymentMethod, OrderStatus } from "@prisma/client";
import { prisma } from "../../configs/prisma.config.js";
import { snap } from "../../configs/midtrans.config.js";

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
          select: { tenantId: true },
        },
      },
    });

    if (!room) {
      throw new Error(`Room with id ${data.roomId} not found`);
    }

    // Calculate booking details
    const checkIn = new Date(data.checkInDate + "T00:00:00.000Z");
    const checkOut = new Date(data.checkOutDate + "T00:00:00.000Z");
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    console.log(`📅 [DEBUG] Backend date parsing:`);
    console.log(
      `  Input checkIn: "${data.checkInDate}" → Parsed: ${
        checkIn.toISOString().split("T")[0]
      } (day ${checkIn.getUTCDate()})`
    );
    console.log(
      `  Input checkOut: "${data.checkOutDate}" → Parsed: ${
        checkOut.toISOString().split("T")[0]
      } (day ${checkOut.getUTCDate()})`
    );

    // Convert Decimal to number and calculate total
    const pricePerNight = Number(room.basePrice);
    const totalAmount = pricePerNight * nights;

    // Generate unique order code
    const orderCode = `ORD-${faker.string
      .alphanumeric({ length: 8 })
      .toUpperCase()}`;

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const booking = await prisma.booking.create({
      data: {
        userId: data.userId,
        propertyId: data.propertyId,
        roomId: data.roomId,
        tenantId: room.Property.tenantId,
        orderCode: orderCode,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights: nights,
        pricePerNight: pricePerNight,
        totalAmount: totalAmount,
        paymentMethod: data.paymentMethod,
        expiresAt: expiresAt,
        status:
          data.paymentMethod === "PAYMENT_GATEWAY"
            ? "PROCESSING"
            : "WAITING_PAYMENT",
      },
    });

    // if payment via Midtrans → create Snap transaction
    if (data.paymentMethod === "PAYMENT_GATEWAY") {
      const orderId = `ORD-${faker.string
        .alphanumeric({ length: 8 })
        .toUpperCase()}`;
      const transaction = await snap.createTransaction({
        transaction_details: {
          order_id: orderId,
          gross_amount: totalAmount,
        },
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          orderId,
          snapToken: transaction.token,
        },
      });

      await prisma.gatewayPayment.upsert({
        where: { orderId: booking.id },
        update: {
          providerRef: orderId,
          snapToken: transaction.token,
          status: "pending",
        },
        create: {
          orderId: booking.id,
          provider: "midtrans",
          providerRef: orderId,
          snapToken: transaction.token,
          status: "pending",
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

  async getBookingsWithPagination(filters: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    userId?: string;
    tenantId?: string;
    propertyId?: string;
  }) {
    return this.managementService.getBookingsWithPagination(filters);
  }

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

  async approvePaymentProof(bookingId: string, tenantId: string) {
    return this.managementService.approvePaymentProof(bookingId, tenantId);
  }

  async rejectPaymentProof(bookingId: string, tenantId: string) {
    return this.managementService.rejectPaymentProof(bookingId, tenantId);
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
