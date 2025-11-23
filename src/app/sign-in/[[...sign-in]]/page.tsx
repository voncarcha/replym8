"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { dark } from "@clerk/themes";
import { useThemeStore } from "@/lib/store";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
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
            theme: theme === "dark" ? dark : undefined,
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border-border shadow-lg",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "bg-muted border-border text-foreground hover:bg-muted/80",
              formButtonPrimary:
                "bg-sky-500 hover:bg-sky-600 text-white dark:text-slate-950",
              formFieldLabel: "text-foreground",
              formFieldInput:
                "bg-background border-border text-foreground focus:border-sky-500",
              footerActionLink: "text-sky-400 hover:text-sky-300",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-sky-400",
            },
          }}
        />
      </div>
    </div>
  );
}

