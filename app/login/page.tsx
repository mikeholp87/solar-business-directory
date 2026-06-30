import { Suspense } from "react";
import LoginForm from "./login-form";
import { pageMetadata } from "@/lib/seo";
import { getSignupEnv } from "@/lib/env";

export const metadata = pageMetadata("Sign in", "Sign in to the installer portal.", "/login", { noindex: true });

export default function LoginPage() {
  const { adminInviteCode } = getSignupEnv();
  return (
    <main className="section-band">
      <div className="container-page max-w-lg">
        {adminInviteCode ? (
          <div className="surface-card mb-4 p-4">
            <p className="eyebrow">Invite-only access</p>
            <p className="mt-2 text-sm text-navy/65">
              Admin signup is enabled in this environment. Use the signup page and enter the invite code to create an admin account.
            </p>
          </div>
        ) : null}
        <Suspense
          fallback={
            <div className="surface-card p-6">
              <p className="eyebrow">Secure access</p>
              <h1 className="text-3xl font-black">Sign in</h1>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
