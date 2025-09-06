"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoginInput, LoginSchema } from "@repo/schemas";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Props = {
  title?: string;
  signupref?: string;
  primaryClass?: string;
};

export default function SignInForm({}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        let message = "";
        if (
          result.error.toLowerCase().includes("credentials") ||
          result.error.toLowerCase().includes("invalid")
        ) {
          message = "Email or password is incorrect. Please try again.";
        } else if (result.error.toLowerCase().includes("network")) {
          message =
            "Network error. Please check your connection and try again.";
        } else if (result.error.toLowerCase().includes("server")) {
          message = "Server error. Please try again later.";
        } else {
          message = result.error || "Login failed. Please try again.";
        }
        toast.error(message);
        setError(message);
        setIsLoading(false);
        return;
      }

      toast.success("Successfully signed in!");

      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(
        "An error occurred during sign in. Please try again. " + message
      );
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}
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

          <Button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
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
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>
      </div>
    </>
  );
}
