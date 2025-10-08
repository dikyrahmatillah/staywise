"use client";

import React from "react";
import Link from "next/link";

type Props = {
  email?: string;
  message?: React.ReactNode;
  onTryAgain?: () => void;
  backToSignInHref?: string;
};

export default function EmailSent({
  email,
  message,
  onTryAgain,
  backToSignInHref = "/signin",
}: Props) {
  const defaultMessage = (
    <>
      We&apos;ve sent a verification email to <strong>{email}</strong>. Please
      check your inbox and follow the instructions.
    </>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-800">{message || defaultMessage}</p>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Didn&apos;t receive the email? Check your spam folder or{" "}
        <button
          onClick={onTryAgain}
          className="text-primary hover:underline font-medium cursor-pointer"
        >
          try again
        </button>
      </p>
      <div className="text-center">
        <Link
          href={backToSignInHref}
          className="text-sm text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
