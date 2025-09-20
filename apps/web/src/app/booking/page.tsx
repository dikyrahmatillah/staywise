"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const getBookingDetails = () => {
    const checkInParam = searchParams.get("checkIn");
    const checkOutParam = searchParams.get("checkOut");

    return {
      propertyId: searchParams.get("propertyId") || "1",
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

  const handleStep1Continue = () => {
    setCurrentStep(2);
  };

  const handlePaymentMethodSelect = (method: "bank" | "midtrans") => {
    setSelectedPaymentMethod(method);
    if (method === "midtrans") {
      setCurrentStep(3);
    } else if (method === "bank") {
      setIsUploadModalOpen(true);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(3);
      setIsUploadModalOpen(false);
    }, 2000);
  };

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
                        Payment submitted successfully!
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your booking request has been sent to the host for
                        approval.
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
                <img
                  src="/luxury-villa-pool.jpg"
                  alt="Villa Bali"
                  className="w-24 h-24 rounded-lg object-cover"
                />
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
              </div>

              {(isProcessing || currentStep >= 3) && (
                <div className="border-t pt-4 mt-6">
                  <h4 className="font-medium mb-4">Transaction Status</h4>
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">
                        Processing payment proof...
                      </span>
                    </div>
                  ) : currentStep >= 3 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Payment submitted
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Awaiting host confirmation. You&apos;ll receive an email
                        once approved.
                      </p>
                    </div>
                  ) : null}
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
                      Processing...
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
