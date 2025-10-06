"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { EmailSchema } from "@/schemas";
import { extractErrorMessage } from "@/lib/auth-error.utils";
import { signIn } from "next-auth/react";
import AuthHeader from "@/components/auth/auth-header";
import api from "@/lib/axios";

export default function GuestSignUpPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "missing-token") {
      toast.error("Missing verification token. Please sign up again.");
    } else if (error === "invalid-or-expired-token") {
      toast.error(
        "Your verification link has expired or is invalid. Please sign up again."
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const parsed = EmailSchema.safeParse(email);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Invalid email");
        return;
      }
      const payload = { email, role: "GUEST" };
      await api.post("/auth/signup", payload);
      toast.success("Verification email sent. Please check your inbox.");
      router.push("/signin");
    } catch (err: unknown) {
      const message = extractErrorMessage(err) || "Signup failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 mb-10">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader
          title="Create your account"
          caption="Already have an account?"
          link="/signin"
          linkWord="Sign in"
        />

        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className={`w-full bg-rose-500 hover:bg-rose-600 text-white cursor-pointer`}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Create account"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <Button
            variant="outline"
            className="w-full cursor-pointer"
            disabled={isLoading}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
