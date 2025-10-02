// apps/web/src/app/booking/hooks/use-midtrans.ts

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loadMidtransScript, removeMidtransScript } from "../lib/midtrans-loader";
import { useBookingContext } from "../context/booking-context";
import type { MidtransResult } from "../types/booking.types";

export function useMidtrans() {
  const router = useRouter();
  const { setCurrentStep } = useBookingContext();

  useEffect(() => {
    loadMidtransScript();
    return () => {
      removeMidtransScript();
    };
  }, []);

  const processMidtransPayment = (snapToken: string): void => {
    if (typeof window === "undefined" || !window.snap) {
      toast.error("Payment system is loading. Please try again in a moment.");
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: (result: MidtransResult) => {
        console.log("Payment success:", result);
        toast.success("Payment completed successfully!");
        setCurrentStep(3);
        setTimeout(() => {
          router.push("/dashboard/guest");
        }, 2000);
      },
      onPending: (result: MidtransResult) => {
        console.log("Payment pending:", result);
        toast.info("Payment is being processed");
        setCurrentStep(3);
      },
      onError: (result: MidtransResult) => {
        console.log("Payment error:", result);
        toast.error("Payment failed. Please try again.");
      },
      onClose: () => {
        console.log("Payment popup closed");
        toast.info("Payment popup was closed");
      },
    });
  };

  return {
    processMidtransPayment,
  };
}