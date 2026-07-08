import type { Metadata } from "next";
import { getSignupEnv } from "@/lib/env";
import SignupForm from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  const { adminInviteCode } = getSignupEnv();
  return <SignupForm adminSignupEnabled={Boolean(adminInviteCode)} />;
}
