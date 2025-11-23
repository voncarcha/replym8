"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to your ReplyM8 account
          </p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl={redirectUrl}
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-slate-900 border-slate-800 shadow-lg",
              headerTitle: "text-slate-50",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton:
                "bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700",
              formButtonPrimary:
                "bg-sky-500 hover:bg-sky-600 text-slate-950",
              formFieldLabel: "text-slate-300",
              formFieldInput:
                "bg-slate-950 border-slate-800 text-slate-100 focus:border-sky-500",
              footerActionLink: "text-sky-400 hover:text-sky-300",
              identityPreviewText: "text-slate-300",
              identityPreviewEditButton: "text-sky-400",
            },
          }}
        />
      </div>
    </div>
  );
}

