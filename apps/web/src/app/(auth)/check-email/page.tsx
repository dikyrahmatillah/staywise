import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function CheckEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams?.email || undefined;

  return (
    <div className="flex items-center justify-center px-4 py-20 min-h-[60vh]">
      <div className="w-full max-w-lg space-y-6 text-center">
        <div className="mx-auto bg-card border border-border rounded-2xl p-6 w-full max-w-md">
          <div className="flex flex-col items-center gap-4  ">
            <div className="bg-rose-50 dark:bg-rose-900 p-3 rounded-full">
              <Mail className="w-6 h-6 text-rose-500" />
            </div>
            <h1 className="text-2xl font-semibold">Verify your email</h1>
            <p className="text-sm text-muted-foreground">
              We just sent a verification link to
              <span className="font-medium text-foreground">
                {" "}
                {email || "your email"}
              </span>
              .
            </p>

            <p className="text-xs text-muted-foreground">
              If you don&apos;t see the email, check your spam or promotions
              folder.
            </p>

            <div className="w-full space-y-2 mt-2">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm w-full h-11"
              >
                I&apos;ve verified — Sign in
              </Link>

              <Link
                href={`/`}
                className="block text-xs text-muted-foreground hover:underline"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
