"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  title?: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
  isProcessing?: boolean;
  processingLabel?: string;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmClassName = "bg-red-600 hover:bg-red-700",
  isProcessing = false,
  processingLabel = "Processing...",
}: DeleteConfirmDialogProps) {
  const handleConfirm = async () => {
    onOpenChange(false);
    try {
      await onConfirm();
    } catch (err) {
      console.error("DeleteConfirmDialog onConfirm error:", err);
    }
  };

  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (isProcessing) return;

      const target = e.target as Node | null;
      if (!contentRef.current) return;

      if (target && contentRef.current.contains(target)) return;

      onOpenChange(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, isProcessing, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div ref={contentRef}>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isProcessing}
              className={confirmClassName}
            >
              {isProcessing ? processingLabel : confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
