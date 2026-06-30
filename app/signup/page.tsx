import { pageMetadata } from "@/lib/seo";
import SignupForm from "./signup-form";

export const metadata = pageMetadata("Sign up", "Create an installer account.", "/signup", { noindex: true });

export default function SignupPage() {
  return <SignupForm />;
}
