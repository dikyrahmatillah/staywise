import SignInForm from "@/components/auth/signin-form";
import AuthHeader from "@/components/auth/auth-header";

export default function GuestSignInPage() {
  return (
    <div className="flex items-center justify-center px-4 py-12 mb-10">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader
          title="Guest sign in"
          caption="Don't have an account?"
          link="/guest-signup"
          linkWord="Sign up"
        />
        <SignInForm title="Guest sign in" signupref="/guest-signup" />
      </div>
    </div>
  );
}
