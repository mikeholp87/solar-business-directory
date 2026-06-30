import { getSignupEnv } from "@/lib/env";
import SignupForm from "./signup-form";

export default function SignupPage() {
  const { adminInviteCode } = getSignupEnv();
  return <SignupForm adminSignupEnabled={Boolean(adminInviteCode)} />;
}
