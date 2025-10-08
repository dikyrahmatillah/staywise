"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoginInput, LoginSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { extractErrorMessage } from "@/lib/auth-error.utils";

type Props = {
  title?: string;
  signupref?: string;
  primaryClass?: string;
  callbackUrl?: string;
};

export default function SignInForm({ callbackUrl = "/dashboard" }: Props) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        const message = "Sign in failed";
        toast.error(message);
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Successfully signed in!");

        let session = await getSession();
        const maxAttempts = 5;
        let attempt = 0;
        while ((!session || !session.user) && attempt < maxAttempts) {
          await new Promise((res) => setTimeout(res, 200));
          session = await getSession();
          attempt += 1;
        }

        if (session?.user?.role === "TENANT") {
          router.push("/dashboard");
        } else {
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      const message =
        extractErrorMessage(error) ||
        (error instanceof Error ? error.message : String(error));
      toast.error(
        "An error occurred during sign in. Please try again. " + (message || "")
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = () => {
    const redirectTo = `/oauth-redirect?callbackUrl=${encodeURIComponent(
      callbackUrl
    )}`;
    signIn("google", { callbackUrl: redirectTo, redirect: true });
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              required
              className="w-full"
              disabled={isLoading}
              {...register("email")}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="********"
                required
                className="w-full pr-10"
                {...register("password")}
                disabled={isLoading}
              />
              <button
                type="button"
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                onClick={() => setIsPasswordVisible((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                disabled={isLoading}
              >
                {isPasswordVisible ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <PrimaryButton
            type="submit"
            className="w-full h-11"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </PrimaryButton>
        </form>

        {/* error handling is done via Sonner toasts */}

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <Button
          variant="outline"
          className="w-full cursor-pointer"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>
      </div>
    </>
  );
}
