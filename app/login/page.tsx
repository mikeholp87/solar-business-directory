import { Suspense } from "react";
import LoginForm from "./login-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Sign in", "Sign in to the installer portal.", "/login", { noindex: true });

export default function LoginPage() {
  return (
    <main className="section-band">
      <div className="container-page max-w-lg">
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
