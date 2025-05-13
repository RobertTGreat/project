import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4 rounded-lg border border-white/10 bg-card/25 text-card-foreground shadow-sm backdrop-blur-xl"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <h1 className="text-2xl font-medium text-white">Reset password</h1>
      <p className="text-sm text-white/70">
        Please enter your new password below.
      </p>
      <Label htmlFor="password" className="text-white">New password</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <Label htmlFor="confirmPassword" className="text-white">Confirm password</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <SubmitButton
        formAction={resetPasswordAction}
        className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md"
      >
        Reset password
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
