import { BookingCronService } from "@/services/booking/cron/booking-cron.service.js";
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
import type { OrderStatus } from "@repo/database/generated/prisma/index.js";

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

  // Core booking operations
  async createBooking(data: BookingCreationData) {
    return this.coreService.createBooking(data);
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
