"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, CreditCard, Building2, Loader2 } from "lucide-react";
import { FileDropzone } from "@/components/guest/file-dropzone";
import { ImagePreview } from "@/components/guest/image-preview";
import { formatCurrency } from "@/lib/booking-formatters";
import { toast } from "sonner";
import axios from "axios";
import type { BookingPaymentMethod, OrderStatus } from "@repo/types";

// API response type for booking creation
interface CreateBookingResponse {
  id: string;
  orderCode: string;
  snapToken?: string;
  status: OrderStatus;
  totalAmount: number;
}

// API request type for booking creation
interface CreateBookingRequest {
  userId: string;
  propertyId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  paymentMethod: BookingPaymentMethod;
}

// Midtrans Snap types
interface MidtransResult {
  order_id: string;
  status_code: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
}

interface MidtransSnap {
  pay: (
    token: string,
    options: {
      onSuccess: (result: MidtransResult) => void;
      onPending: (result: MidtransResult) => void;
      onError: (result: MidtransResult) => void;
      onClose: () => void;
    }
  ) => void;
}

declare global {
  interface Window {
    snap: MidtransSnap;
  }
}

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    "full" | "partial"
  >("full");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "bank" | "midtrans" | null
  >(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] =
    useState<CreateBookingResponse | null>(null);

  const getBookingDetails = () => {
    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");

    return {
      propertyId: searchParams.get("propertyId") || "1",
      roomId: searchParams.get("roomId") || "1", // Add roomId to your URL params
      checkIn: checkInParam ? new Date(checkInParam) : new Date("2024-10-11"),
      checkOut: checkOutParam
        ? new Date(checkOutParam)
        : new Date("2024-10-12"),
      adults: Number.parseInt(searchParams.get("adults") || "2"),
      children: Number.parseInt(searchParams.get("children") || "0"),
      pets: Number.parseInt(searchParams.get("pets") || "0"),
      pricePerNight: Number.parseInt(
        searchParams.get("pricePerNight") || "1_000_000"
      ),
    };
  };

  const bookingDetails = getBookingDetails();

  const nights = Math.ceil(
    (bookingDetails.checkOut.getTime() - bookingDetails.checkIn.getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const totalPrice = bookingDetails.pricePerNight * nights;
  const totalGuests = bookingDetails.adults + bookingDetails.children;

  // Create API instance with auth token
  const createApiInstance = () => {
    const api = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    });

    if (session?.user?.accessToken) {
      api.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;
    }

    return api;
  };

  const createBooking = async (): Promise<CreateBookingResponse> => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const api = createApiInstance();

    // Match your booking.service.ts interface exactly
    const bookingData = {
      userId: session.user.id,
      propertyId: bookingDetails.propertyId,
      roomId: bookingDetails.roomId,
      checkInDate: bookingDetails.checkIn.toISOString().split("T")[0], // Send as YYYY-MM-DD
      checkOutDate: bookingDetails.checkOut.toISOString().split("T")[0], // Send as YYYY-MM-DD
      paymentMethod:
        selectedPaymentMethod === "midtrans"
          ? ("PAYMENT_GATEWAY" as const)
          : ("MANUAL_TRANSFER" as const),
    };

    console.log("Creating booking with data:", bookingData);
    console.log("Date values:", {
      originalCheckIn: bookingDetails.checkIn,
      originalCheckOut: bookingDetails.checkOut,
      sentCheckInDate: bookingData.checkInDate,
      sentCheckOutDate: bookingData.checkOutDate,
    });
    console.log("Total price calculated:", totalPrice);
    console.log("Nights:", nights);

    const response = await api.post<CreateBookingResponse>(
      "/bookings",
      bookingData
    );
    console.log("Booking created successfully:", response.data);
    return response.data;
  };

  const handleStep1Continue = () => {
    setCurrentStep(2);
  };

  const handlePaymentMethodSelect = (method: "bank" | "midtrans") => {
    setSelectedPaymentMethod(method);
  };

  const handlePayNow = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      const booking = await createBooking();
      setCreatedBooking(booking);

      if (selectedPaymentMethod === "midtrans" && booking.snapToken) {
        // Redirect to Midtrans payment page
        // @ts-expect-error - Midtrans snap global object may not be available
        window.snap.pay(booking.snapToken, {
          onSuccess: function (result: MidtransResult) {
            console.log("Payment success:", result);
            toast.success("Payment completed successfully!");
            setCurrentStep(3);
            // Optionally redirect to bookings dashboard
            setTimeout(() => {
              router.push("/dashboard/guest");
            }, 2000);
          },
          onPending: function (result: MidtransResult) {
            console.log("Payment pending:", result);
            toast.info("Payment is being processed");
            setCurrentStep(3);
          },
          onError: function (result: MidtransResult) {
            console.log("Payment error:", result);
            toast.error("Payment failed. Please try again.");
          },
          onClose: function () {
            console.log("Payment popup closed");
            toast.info("Payment popup was closed");
          },
        });
      } else if (selectedPaymentMethod === "bank") {
        // For manual transfer, immediately open payment proof dialog
        toast.success(
          "Booking created! Please upload payment proof within 1 hour."
        );
        setIsUploadModalOpen(true);
        setCurrentStep(3); // Move to step 3 as booking is created
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to create booking";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleProcessPayment = async () => {
    if (!uploadedFile || !createdBooking) {
      toast.error("Please select a file and ensure booking is created");
      return;
    }

    // Validate file on frontend before upload
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(uploadedFile.type)) {
      toast.error("Invalid file type. Only JPEG and PNG files are allowed.");
      return;
    }

    if (uploadedFile.size > maxSize) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    setIsProcessing(true);

    try {
      const api = createApiInstance();
      const formData = new FormData();
      formData.append("paymentProof", uploadedFile);

      console.log("Uploading payment proof for booking:", createdBooking);
      console.log("Using booking ID as orderId:", createdBooking.id);
      console.log("File details:", {
        name: uploadedFile.name,
        type: uploadedFile.type,
        size: uploadedFile.size,
        sizeFormatted: `${(uploadedFile.size / 1024 / 1024).toFixed(2)}MB`,
      });

      // Use booking.id for the orderId parameter (PaymentProofParamsSchema likely expects booking ID)
      const response = await api.post(
        `/bookings/${createdBooking.id}/payment-proof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Payment proof uploaded successfully:", response.data);
      toast.success("Payment proof uploaded successfully!");
      setCurrentStep(3);
      setIsUploadModalOpen(false);

      // Redirect to bookings dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/guest");
      }, 2000);
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      if (axios.isAxiosError(error)) {
        console.error("Full error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          url: error.config?.url,
          method: error.config?.method,
        });

        // Handle specific error cases
        let errorMessage = "Failed to upload payment proof";

        if (error.response?.status === 400) {
          const responseData = error.response.data;
          if (responseData?.message) {
            errorMessage = responseData.message;
          } else if (responseData?.error) {
            errorMessage = responseData.error;
          } else if (typeof responseData === "string") {
            errorMessage = responseData;
          } else {
            errorMessage =
              "Invalid request. Please check your file and try again.";
          }
        } else if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error.response?.status === 404) {
          errorMessage =
            "Booking not found. Please try creating a new booking.";
        } else if (error.response?.status === 413) {
          errorMessage = "File too large. Maximum size is 5MB.";
        }

        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect to login if not authenticated
  if (!session) {
    router.push("/auth/login");
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-semibold">Request to book</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Steps */}
          <div className="space-y-6">
            {/* Step 1 - Payment Selection */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= 1
                      ? "bg-foreground text-background"
                      : "border-2 border-muted-foreground text-muted-foreground"
                  }`}
                >
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Choose how to pay
                  </h3>

                  <RadioGroup
                    value={selectedPaymentType}
                    onValueChange={(value) =>
                      setSelectedPaymentType(value as "full" | "partial")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <label htmlFor="full" className="cursor-pointer">
                        Pay {formatCurrency(totalPrice)} now
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="partial" id="partial" disabled />
                      <label htmlFor="partial" className="cursor-not-allowed">
                        <div>Pay part now, part later</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(totalPrice * 0.5)} now, {""}
                          {formatCurrency(totalPrice * 0.5)} on arrival No extra
                          fees.
                        </div>
                      </label>
                    </div>
                  </RadioGroup>

                  <Button
                    className="w-full mt-4 bg-foreground text-background hover:bg-foreground/90"
                    onClick={handleStep1Continue}
                    disabled={currentStep > 1}
                  >
                    {currentStep > 1 ? "Completed" : "Continue"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Step 2 - Payment Method */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= 2
                      ? "bg-foreground text-background"
                      : "border-2 border-muted-foreground text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      currentStep < 2 ? "text-muted-foreground" : ""
                    }`}
                  >
                    Add payment method
                  </h3>

                  {currentStep >= 2 && (
                    <div className="space-y-4 mt-4">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPaymentMethod === "bank"
                            ? "border-foreground bg-muted/50"
                            : "border-muted-foreground hover:border-foreground/50"
                        }`}
                        onClick={() => handlePaymentMethodSelect("bank")}
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5" />
                          <div>
                            <div className="font-medium">
                              Manual Transfer via Bank
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Upload payment proof after transfer
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPaymentMethod === "midtrans"
                            ? "border-foreground bg-muted/50"
                            : "border-muted-foreground hover:border-foreground/50"
                        }`}
                        onClick={() => handlePaymentMethodSelect("midtrans")}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <div className="font-medium">
                              Payment Gateway (Midtrans)
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Pay instantly with credit card or e-wallet
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Step 3 - Review Request */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= 3
                      ? "bg-foreground text-background"
                      : "border-2 border-muted-foreground text-muted-foreground"
                  }`}
                >
                  3
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${
                      currentStep < 3 ? "text-muted-foreground" : ""
                    }`}
                  >
                    Review your request
                  </h3>
                  {currentStep >= 3 && (
                    <div className="mt-4">
                      <p className="text-green-600 font-medium">
                        {selectedPaymentMethod === "midtrans"
                          ? "Payment completed successfully!"
                          : "Booking created successfully!"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {createdBooking && (
                          <>
                            Booking ID: {createdBooking.orderCode}
                            <br />
                            {selectedPaymentMethod === "bank"
                              ? "Please upload payment proof to complete your booking."
                              : "Your booking has been confirmed."}
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    Luxury Villa in Bali
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>★ 4.83 (92)</span>
                    <span>•</span>
                    <span>Superhost</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="text-sm font-medium">Free cancellation</div>
                <div className="text-sm text-muted-foreground">
                  Cancel before October 10 for a full refund. Cancellation
                  policy
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dates</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm underline p-0 h-auto"
                    disabled={currentStep >= 3}
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-sm">
                  {bookingDetails.checkIn.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {bookingDetails.checkOut.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Guests</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm underline p-0 h-auto"
                    disabled={currentStep >= 3}
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-sm">
                  {totalGuests} guest{totalGuests > 1 ? "s" : ""}
                  {bookingDetails.pets > 0 &&
                    `, ${bookingDetails.pets} pet${
                      bookingDetails.pets > 1 ? "s" : ""
                    }`}
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h4 className="font-medium mb-4">Price details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {nights} night{nights > 1 ? "s" : ""} x Rp
                      {bookingDetails.pricePerNight.toLocaleString()}
                    </span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total (IDR)</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                {currentStep >= 2 &&
                  selectedPaymentMethod &&
                  currentStep < 3 && (
                    <div className="mt-4">
                      <Button
                        className="w-full bg-foreground text-background hover:bg-foreground/90"
                        onClick={handlePayNow}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Booking...
                          </>
                        ) : (
                          "Pay Now"
                        )}
                      </Button>
                    </div>
                  )}

                {currentStep >= 3 && (
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={() => router.push("/dashboard/guest")}
                    >
                      View My Bookings
                    </Button>
                  </div>
                )}
              </div>

              {currentStep >= 3 && createdBooking && (
                <div className="border-t pt-4 mt-6">
                  <h4 className="font-medium mb-4">Booking Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Booking ID:</span>
                      <span className="font-mono">
                        {createdBooking.orderCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">
                        {createdBooking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(createdBooking.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Modal for file upload */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Payment Proof</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Bank Transfer Details:
              </p>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Bank: BCA</p>
                <p>Account: 1234567890</p>
                <p>Name: Tenant Name</p>
                <p>
                  Amount:{" "}
                  {selectedPaymentType === "full"
                    ? formatCurrency(totalPrice)
                    : formatCurrency(totalPrice * 0.5)}
                </p>
                {createdBooking && <p>Reference: {createdBooking.orderCode}</p>}
              </div>
            </div>

            {!uploadedFile ? (
              <FileDropzone onFileSelect={handleFileSelect} />
            ) : (
              <div className="space-y-4">
                <ImagePreview
                  file={uploadedFile}
                  onRemove={() => setUploadedFile(null)}
                  title="Payment Proof"
                />
                <Button
                  className="w-full"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Submit Payment Proof"
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
