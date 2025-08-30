import SignInForm from "@/components/auth/signin-form";
import AuthHeader from "@/components/auth/auth-header";

export default function TenantSignInPage() {
  return (
    <div className="flex items-center justify-center px-4 py-12 mb-10">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader
          title="Property owner sign in"
          caption="Not got an account?"
          link="/tenant-signup"
        />
        <SignInForm title="Property owner sign in" signupref="/tenant-signup" />
      </div>
    </div>
  );
}
