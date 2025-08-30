"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params?.get("token") ?? "";
  const flow = (params?.get("type") ?? "verify").toLowerCase();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {flow === "reset"
              ? "Reset your password"
              : "Verify your email & set password"}
          </h1>
          <p className="text-muted-foreground">
            {token
              ? flow === "reset"
                ? "Set a new password for your account."
                : "Set your account password to complete verification."
              : "Invalid or missing token."}
          </p>
        </div>

        <div>
          <form className="space-y-6">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !token}
              />
            </div>

            <div>
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                disabled={loading || !token}
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading || !token}
            >
              {loading
                ? "Submitting..."
                : flow === "reset"
                ? "Reset password"
                : "Set password & verify"}
            </Button>

            {message && <p className="text-sm mt-2 text-center">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
