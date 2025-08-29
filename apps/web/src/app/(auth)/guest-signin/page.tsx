import SignInForm from "@/components/auth/signin-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuestSignInPage() {
  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <SignInForm
          title="User guest sign in"
          registerHref="/tenant-register"
        />

        <div className="text-center space-y-4">
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Find dream country houses to rent
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Your little black book of trusted big holiday houses.
            </p>
            <Link href="/search">
              <Button
                variant="outline"
                className="font-medium text-rose-500 cursor-pointer"
              >
                Search houses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
