"use client";

import { useState } from "react";

export const useBookingCardDialogs = () => {
  const [paymentProofDialogOpen, setPaymentProofDialogOpen] = useState(false);
  const [paymentProofViewDialogOpen, setPaymentProofViewDialogOpen] =
    useState(false);
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  return {
    paymentProofDialog: {
      open: paymentProofDialogOpen,
      setOpen: setPaymentProofDialogOpen,
    },
    paymentProofViewDialog: {
      open: paymentProofViewDialogOpen,
      setOpen: setPaymentProofViewDialogOpen,
    },
    cancellationDialog: {
      open: cancellationDialogOpen,
      setOpen: setCancellationDialogOpen,
    },
    reviewDialog: {
      open: reviewDialogOpen,
      setOpen: setReviewDialogOpen,
    },
  };
};