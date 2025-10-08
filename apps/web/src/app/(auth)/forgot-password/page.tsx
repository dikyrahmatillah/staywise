"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrimaryButton from "@/components/ui/primary-button";
import AuthHeader from "@/components/auth/auth-header";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading] = useState(false);
  const [message] = useState("");

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader
          title="Forgot password"
          caption="Enter your email to reset your password"
        />

        <div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={loading}
              />
            </div>

            <PrimaryButton
              type="submit"
              className="w-full h-11"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </PrimaryButton>

            {message && <p className="text-sm mt-2 text-center">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
