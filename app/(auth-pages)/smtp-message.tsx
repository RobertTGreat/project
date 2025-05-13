import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";

export function SmtpMessage() {
  return (
    <div className="bg-white/5 px-5 py-3 border border-white/10 rounded-md flex gap-4 backdrop-blur-md mt-4">
      <InfoIcon size={16} className="mt-0.5 text-white/70" />
      <div className="flex flex-col gap-1">
        <small className="text-sm text-white/70">
          <strong className="text-white"> Note:</strong> Emails are rate limited. Enable Custom SMTP to
          increase the rate limit.
        </small>
        <div>
          <Link
            href="https://supabase.com/docs/guides/auth/auth-smtp"
            target="_blank"
            className="text-white/50 hover:text-white flex items-center text-sm gap-1"
          >
            Learn more <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
