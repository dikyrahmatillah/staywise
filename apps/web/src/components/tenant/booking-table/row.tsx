"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, FileImage, User, Mail } from "lucide-react";
import type { BookingTransaction } from "@repo/types";
import type { PaymentProof } from "@repo/types";
import { StatusBadge } from "@/components/guest/my-bookings/status-badge";
import { formatCurrency } from "@/lib/booking-formatters";
import { toast } from "sonner";
import Image from "next/image";

interface TenantBookingTableRowProps {
  booking: BookingTransaction;
  onApprovePayment?: (bookingId: string) => Promise<void>;
  onRejectPayment?: (bookingId: string) => Promise<void>;
  onBookingUpdate?: () => void;
}

// Guest Info Component
const GuestInfo = ({ user }: { user: BookingTransaction["User"] }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium text-sm">
        {user.firstName} {user.lastName}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Mail className="h-3 w-3 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{user.email}</span>
    </div>
  </div>
);

// Property & Room Info Component
const PropertyRoomInfo = ({
  property,
  room,
}: {
  property: BookingTransaction["Property"];
  room: BookingTransaction["Room"];
}) => (
  <div className="flex flex-col gap-1">
    <span className="font-medium text-sm truncate max-w-[150px]">
      {property.name}
    </span>
    <span className="text-xs text-muted-foreground">{room.name}</span>
  </div>
);

// Booking Details Component
const BookingDetails = ({
  orderCode,
  checkInDate,
  checkOutDate,
  nights,
}: {
  orderCode: string;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-mono text-muted-foreground">{orderCode}</span>
    <span className="text-sm font-medium">
      {new Date(checkInDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}{" "}
      →{" "}
      {new Date(checkOutDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}
    </span>
    <span className="text-xs text-muted-foreground">
      {nights} night{nights > 1 ? "s" : ""}
    </span>
  </div>
);

// Payment Info Component
const PaymentInfo = ({
  totalAmount,
  paymentMethod,
  paymentProof,
}: {
  totalAmount: number;
  paymentMethod: string;
  paymentProof?: PaymentProof | null;
}) => (
  <div className="flex flex-col gap-1">
    <span className="font-medium text-base">{formatCurrency(totalAmount)}</span>
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">
        {paymentMethod === "MANUAL_TRANSFER"
          ? "Manual Transfer"
          : "Payment Gateway"}
      </span>
      {paymentMethod === "MANUAL_TRANSFER" && paymentProof && (
        <Badge
          variant={
            paymentProof.rejectedAt
              ? "destructive"
              : paymentProof.acceptedAt
              ? "default"
              : "secondary"
          }
          className="text-xs w-fit"
        >
          {paymentProof.rejectedAt
            ? "Proof Rejected"
            : paymentProof.acceptedAt
            ? "Proof Approved"
            : "Proof Uploaded"}
        </Badge>
      )}
    </div>
  </div>
);

// Payment Proof Viewer Dialog Component
const PaymentProofViewer = ({
  booking,
  open,
  onOpenChange,
}: {
  booking: BookingTransaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Payment Proof - {booking.orderCode}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {booking.paymentProof?.imageUrl && (
          <div className="space-y-2">
            <Image
              src={booking.paymentProof.imageUrl}
              alt="Payment Proof"
              className="w-full max-h-96 object-contain rounded-lg border"
            />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                Uploaded:{" "}
                {new Date(booking.paymentProof.uploadedAt).toLocaleString()}
              </p>
              <p>
                Guest: {booking.User.firstName} {booking.User.lastName}
              </p>
              <p>Amount: {formatCurrency(booking.totalAmount)}</p>
              {booking.paymentProof.acceptedAt && (
                <p className="text-green-600">
                  Approved:{" "}
                  {new Date(booking.paymentProof.acceptedAt).toLocaleString()}
                </p>
              )}
              {booking.paymentProof.rejectedAt && (
                <p className="text-red-600">
                  Rejected:{" "}
                  {new Date(booking.paymentProof.rejectedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export const TenantBookingTableRow = ({
  booking,
  onApprovePayment,
  onRejectPayment,
  onBookingUpdate,
}: TenantBookingTableRowProps) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [paymentProofDialogOpen, setPaymentProofDialogOpen] = useState(false);

  const handleApprove = async () => {
    if (!onApprovePayment) return;

    setIsApproving(true);
    try {
      await onApprovePayment(booking.id);
      toast.success("Payment proof approved successfully");
      onBookingUpdate?.();
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("Failed to approve payment proof");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!onRejectPayment) return;

    setIsRejecting(true);
    try {
      await onRejectPayment(booking.id);
      toast.success("Payment proof rejected successfully");
      onBookingUpdate?.();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error("Failed to reject payment proof");
    } finally {
      setIsRejecting(false);
    }
  };

  const renderActions = () => {
    // WAITING_CONFIRMATION + MANUAL_TRANSFER = Payment proof needs review
    if (
      booking.status === "WAITING_CONFIRMATION" &&
      booking.paymentMethod === "MANUAL_TRANSFER" &&
      booking.paymentProof &&
      !booking.paymentProof.acceptedAt &&
      !booking.paymentProof.rejectedAt
    ) {
      return (
        <div className="flex gap-2">
          {/* View Payment Proof */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-3 h-8"
            onClick={() => setPaymentProofDialogOpen(true)}
          >
            <FileImage className="h-3 w-3 mr-1" />
            View
          </Button>

          {/* Approve */}
          <Button
            variant="default"
            size="sm"
            className="rounded-full px-3 h-8 bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={isApproving}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            {isApproving ? "Approving..." : "Approve"}
          </Button>

          {/* Reject */}
          <Button
            variant="destructive"
            size="sm"
            className="rounded-full px-3 h-8"
            onClick={handleReject}
            disabled={isRejecting}
          >
            <XCircle className="h-3 w-3 mr-1" />
            {isRejecting ? "Rejecting..." : "Reject"}
          </Button>
        </div>
      );
    }

    // For other statuses, show details button
    return (
      <Button
        variant="outline"
        size="sm"
        className="rounded-full px-4 h-8"
        onClick={() => {
          // Handle general details view
          console.log("View booking details:", booking.id);
        }}
      >
        <Eye className="h-3 w-3 mr-1" />
        Details
      </Button>
    );
  };

  const renderStatus = () => {
    // Use StatusBadge for main booking status
    const statusDisplay = <StatusBadge status={booking.status} />;

    // For manual transfers with payment proof, show additional info
    if (booking.paymentMethod === "MANUAL_TRANSFER" && booking.paymentProof) {
      return (
        <div className="flex flex-col items-center gap-1">
          {statusDisplay}
          <span className="text-xs text-blue-600">
            {booking.paymentProof.rejectedAt
              ? "Proof Rejected"
              : booking.paymentProof.acceptedAt
              ? "Proof Approved"
              : "Proof Uploaded"}
          </span>
        </div>
      );
    }

    return statusDisplay;
  };

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        {/* Guest Info */}
        <TableCell className="py-4">
          <GuestInfo user={booking.User} />
        </TableCell>

        {/* Property & Room */}
        <TableCell className="py-4">
          <PropertyRoomInfo property={booking.Property} room={booking.Room} />
        </TableCell>

        {/* Booking Details */}
        <TableCell className="text-center py-4">
          <BookingDetails
            orderCode={booking.orderCode}
            checkInDate={booking.checkInDate}
            checkOutDate={booking.checkOutDate}
            nights={booking.nights}
          />
        </TableCell>

        {/* Payment Info */}
        <TableCell className="text-center py-4">
          <PaymentInfo
            totalAmount={booking.totalAmount}
            paymentMethod={booking.paymentMethod}
            paymentProof={booking.paymentProof}
          />
        </TableCell>

        {/* Status - Using StatusBadge component */}
        <TableCell className="text-center py-4">
          <div className="flex justify-center">{renderStatus()}</div>
        </TableCell>

        {/* Actions */}
        <TableCell className="text-center py-4">{renderActions()}</TableCell>
      </TableRow>

      {/* Payment Proof Viewer Dialog */}
      <PaymentProofViewer
        booking={booking}
        open={paymentProofDialogOpen}
        onOpenChange={setPaymentProofDialogOpen}
      />
    </>
  );
};
