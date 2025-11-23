"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export function LandingNavbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="w-full border-b border-slate-800">
      <div className="mx-auto max-w-6xl w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
            <span className="text-sm font-semibold tracking-tight">R8</span>
          </div>
          <span className="text-sm sm:text-base font-medium tracking-tight text-slate-50">
            ReplyM8
          </span>
        </Link>

        {/* Nav actions */}
        <div className="hidden sm:flex items-center gap-6 text-xs sm:text-sm">
          <a
            href="#features"
            className="text-slate-300 hover:text-slate-100 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-slate-300 hover:text-slate-100 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="text-slate-300 hover:text-slate-100 transition-colors"
          >
            Stories
          </a>
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-sky-500 text-slate-950 text-xs sm:text-sm font-medium tracking-tight px-3 sm:px-4 py-1.5 hover:bg-sky-400 shadow-sm shadow-sky-500/40">
                  <span>Dashboard</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 bg-white border-2 border-slate-700",
                    userButtonAvatarBox: "bg-white",
                    userButtonPopoverCard: "bg-slate-900 border-slate-800",
                    userButtonPopoverActionButton: "text-slate-100 hover:bg-slate-800",
                    userButtonPopoverActionButtonText: "text-slate-300",
                  },
                }}
              />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex items-center rounded-full border-slate-700 bg-slate-900/70 text-xs sm:text-sm text-slate-100 px-3 sm:px-4 py-1.5 hover:border-slate-500 hover:bg-slate-900"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="inline-flex items-center gap-1.5 rounded-full bg-sky-500 text-slate-950 text-xs sm:text-sm font-medium tracking-tight px-3 sm:px-4 py-1.5 hover:bg-sky-400 shadow-sm shadow-sky-500/40">
                  <span>Get started</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

