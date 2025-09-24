import { AppError } from "../errors/app.error.js";

export class PropertyValidator {
  static validateSlug(slug: string): void {
    if (!slug) {
      throw new AppError("Missing property slug", 400);
    }
  }

  static validatePropertyId(propertyId: string): void {
    if (!propertyId) {
      throw new AppError("Missing property ID", 400);
    }
  }

  static validateTenantAccess(tenantId?: string): void {
    if (!tenantId) {
      throw new AppError("Tenant ID is required", 400);
    }
  }

  static validateActiveBookings(activeBookingCount: number): void {
    if (activeBookingCount > 0) {
      throw new AppError("Cannot delete property with active bookings", 400);
    }
  }

  static validatePropertyExists(property: any, tenantId?: string): void {
    if (!property) {
      const message = tenantId
        ? "Property not found or you don't have permission to access it"
        : "Property not found";
      throw new AppError(message, 404);
    }
  }

  static validateDeletePermission(property: any): void {
    if (!property) {
      throw new AppError(
        "Property not found or you don't have permission to delete it",
        404
      );
    }
  }

  static validateUpdatePermission(property: any): void {
    if (!property) {
      throw new AppError(
        "Property not found or you don't have permission to update it",
        404
      );
    }
  }
}
