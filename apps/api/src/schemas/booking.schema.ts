import { z } from "zod";

// Helper function to check if a date is in the past
const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Helper function to check if checkout is after checkin
const isCheckoutAfterCheckin = (checkin: Date, checkout: Date): boolean => {
  return checkout > checkin;
};

// Helper function to calculate nights between dates
const calculateNights = (checkin: Date, checkout: Date): number => {
  const timeDiff = checkout.getTime() - checkin.getTime();
  return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
};

// Base booking validation schema
export const bookingValidationSchema = (maxGuests: number = 10) =>
  z
    .object({
      checkInDate: z
        .date({
          message: "Please select a valid check-in date"
        })
        .refine((date) => !isDateInPast(date), {
          message: "Check-in date cannot be in the past",
        }),

      checkOutDate: z
        .date({
          message: "Please select a valid check-out date"
        })
        .refine((date) => !isDateInPast(date), {
          message: "Check-out date cannot be in the past",
        }),

      adults: z
        .number()
        .min(1, "At least one adult is required")
        .max(maxGuests, `Maximum ${maxGuests} adults allowed`),

      children: z
        .number()
        .min(0, "Children count cannot be negative")
        .max(maxGuests, `Maximum ${maxGuests} children allowed`),

      pets: z
        .number()
        .min(0, "Pets count cannot be negative")
        .max(4, "Maximum 4 pets allowed"),

      propertyId: z.string().min(1, "Property ID is required"),

      pricePerNight: z.number().positive("Price per night must be positive"),
    })
    .refine(
      (data) => isCheckoutAfterCheckin(data.checkInDate, data.checkOutDate),
      {
        message: "Check-out date must be after check-in date",
        path: ["checkOutDate"],
      }
    )
    .refine(
      (data) => calculateNights(data.checkInDate, data.checkOutDate) >= 1,
      {
        message: "Minimum stay is 1 night",
        path: ["checkOutDate"],
      }
    )
    .refine((data) => data.adults + data.children <= maxGuests, {
      message: `Total guests cannot exceed ${maxGuests}`,
      path: ["adults"],
    })
    .refine(
      (data) => calculateNights(data.checkInDate, data.checkOutDate) <= 365,
      {
        message: "Maximum stay is 365 nights",
        path: ["checkOutDate"],
      }
    );

// Type for the validated booking data
export type BookingFormData = z.infer<
  ReturnType<typeof bookingValidationSchema>
>;

// Validation result type
export type BookingValidationResult = {
  success: boolean;
  data?: BookingFormData;
  errors?: Record<string, string>;
};

// Function to validate booking data
export const validateBookingData = (
  data: Partial<BookingFormData>,
  maxGuests: number = 10
): BookingValidationResult => {
  const schema = bookingValidationSchema(maxGuests);

  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};

      error.issues.forEach((issue: z.ZodIssue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: { general: "Validation failed" },
    };
  }
};

// Alternative validation function with better error handling for required fields
export const validateBookingDataSafe = (
  data: any,
  maxGuests: number = 10
): BookingValidationResult => {
  const schema = bookingValidationSchema(maxGuests);

  // Pre-validate required fields
  const requiredFields = ['checkInDate', 'checkOutDate', 'adults', 'children', 'pets', 'propertyId', 'pricePerNight'];
  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    const errors: Record<string, string> = {};
    missingFields.forEach(field => {
      switch (field) {
        case 'checkInDate':
          errors[field] = 'Check-in date is required';
          break;
        case 'checkOutDate':
          errors[field] = 'Check-out date is required';
          break;
        default:
          errors[field] = `${field} is required`;
      }
    });
    
    return {
      success: false,
      errors,
    };
  }

  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};

      error.issues.forEach((issue: z.ZodIssue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: { general: "Validation failed" },
    };
  }
};

// Additional validation utilities
export const bookingValidationUtils = {
  // Check if dates are available (you can extend this with actual availability data)
  checkDateAvailability: (checkin: Date, checkout: Date): boolean => {
    // This is a placeholder - replace with actual availability check
    return true;
  },

  // Calculate total price with validation
  calculateTotalPrice: (
    checkin: Date,
    checkout: Date,
    pricePerNight: number
  ): number => {
    const nights = calculateNights(checkin, checkout);
    return nights * pricePerNight;
  },

  // Format validation errors for display
  formatValidationErrors: (errors: Record<string, string>): string[] => {
    return Object.values(errors);
  },

  // Check if booking is for today or future dates
  isValidBookingPeriod: (checkin: Date, checkout: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkin >= today && checkout > checkin;
  },
};