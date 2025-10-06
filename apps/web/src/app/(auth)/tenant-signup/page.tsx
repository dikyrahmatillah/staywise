"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EmailSchema } from "@/schemas";
import { extractErrorMessage } from "@/lib/auth-error.utils";
import { signIn } from "next-auth/react";
import AuthHeader from "@/components/auth/auth-header";
import api from "@/lib/axios";

export default function TenantSignUpPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

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
          title="Tenant sign up"
          caption="Already have an account?"
          link="/signin"
          linkWord="Sign in"
        />

        <div>
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
            onClick={() =>
              signIn("google-tenant", { callbackUrl: "/dashboard" })
            }
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
