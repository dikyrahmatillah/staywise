"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
// router no longer needed because we show inline confirmation instead of redirect
import { EmailSchema } from "@/schemas";
import { extractErrorMessage } from "@/lib/auth-error.utils";
import { signIn } from "next-auth/react";
import AuthHeader from "@/components/auth/auth-header";
import api from "@/lib/axios";
import { Building2, Sparkles } from "lucide-react";
import EmailSent from "@/components/auth/email-sent";

export default function TenantSignUpPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const parsed = EmailSchema.safeParse(email);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Invalid email");
        return;
      }
      const payload = { email, role: "TENANT" };
      await api.post("/auth/signup", payload);
      toast.success("Verification email sent. Please check your inbox.");
      setEmailSent(true);
    } catch (err: unknown) {
      const message =
        extractErrorMessage(err) || "Signup failed. Please try again later.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 mb-10 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full animate-pulse" />
              <div className="relative bg-gradient-to-br from-rose-500 to-rose-600 p-4 rounded-2xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <AuthHeader
            title="Start Hosting Today"
            caption="Already have an account?"
            link="/signin"
            linkWord="Sign in"
          />
          <p className="text-center text-sm text-muted-foreground max-w-sm mx-auto">
            Join thousands of property owners and start earning from your
            property
          </p>
        </div>

        <div>
          {emailSent ? (
            <EmailSent email={email} onTryAgain={() => setEmailSent(false)} />
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                <PrimaryButton
                  type="submit"
                  className="w-full h-11 px-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Create account
                    </span>
                  )}
                </PrimaryButton>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-sm text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 border-2 hover:bg-accent/50 hover:border-accent-foreground/20 transition-all duration-200 font-medium"
                disabled={isLoading}
                onClick={() =>
                  signIn("google-tenant", { callbackUrl: "/dashboard" })
                }
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
            </>
          )}
        </div>

        <div className="bg-gradient-to-br from-rose-50/50 to-orange-50/50 dark:from-rose-950/20 dark:to-orange-950/20 border border-rose-200/50 dark:border-rose-800/30 rounded-xl p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Why host with us?
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">✓</span>
                <span>Easy property management dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">✓</span>
                <span>Secure payment processing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">✓</span>
                <span>24/7 host support and guidance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
