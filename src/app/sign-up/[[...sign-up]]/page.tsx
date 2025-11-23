import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Get started with ReplyM8 today
          </p>
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
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

