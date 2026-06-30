import { pageMetadata } from "@/lib/seo";
import { getSignupEnv } from "@/lib/env";
import SignupForm from "./signup-form";

export const metadata = pageMetadata("Sign up", "Create an installer account or request admin access.", "/signup", { noindex: true });

export default function SignupPage() {
  const { adminInviteCode } = getSignupEnv();
  return <SignupForm adminSignupEnabled={Boolean(adminInviteCode)} />;
}
