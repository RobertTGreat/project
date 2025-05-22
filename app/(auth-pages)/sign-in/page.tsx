import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

//Sign in page
export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium text-white">Sign in</h1>
      <p className="text-sm text-white/70">
        Don't have an account?{" "}
        <Link className="text-white font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-white">Password</Label>
          <Link
            className="text-xs text-white/70 underline hover:text-white"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton
          pendingText="Signing In..."
          formAction={signInAction}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md"
        >
          Sign in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
