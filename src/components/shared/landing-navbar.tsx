"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useThemeStore } from "@/lib/store";

export function LandingNavbar() {
  const { isSignedIn } = useUser();
  const theme = useThemeStore((state) => state.theme);

  return (
    <header className="w-full border-b border-border">
      <div className="mx-auto max-w-6xl w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-card border border-border flex items-center justify-center">
            <span className="text-sm font-semibold tracking-tight text-foreground">R8</span>
          </div>
          <span className="text-sm sm:text-base font-medium tracking-tight text-foreground">
            ReplyM8
          </span>
        </Link>

        {/* Nav actions */}
        <div className="hidden sm:flex items-center gap-6 text-xs sm:text-sm">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Stories
          </a>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-sky-500 text-white dark:text-slate-950 text-xs sm:text-sm font-medium tracking-tight px-3 sm:px-4 py-1.5 hover:bg-sky-400 shadow-sm shadow-sky-500/40">
                  <span>Dashboard</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <UserButton
                appearance={{
                  theme: theme === "dark" ? dark : undefined,
                  elements: {
                    avatarBox: "h-8 w-8 bg-white dark:bg-white border-2 border-border",
                    userButtonAvatarBox: "bg-white dark:bg-white",
                    userButtonPopoverCard: "bg-card border-border",
                    userButtonPopoverActionButton: "text-foreground hover:bg-muted",
                    userButtonPopoverActionButtonText: "text-muted-foreground",
                  },
                }}
              />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex items-center rounded-full border-border bg-card/70 text-xs sm:text-sm text-foreground px-3 sm:px-4 py-1.5 hover:bg-muted"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="inline-flex items-center gap-1.5 rounded-full bg-sky-500 text-white dark:text-slate-950 text-xs sm:text-sm font-medium tracking-tight px-3 sm:px-4 py-1.5 hover:bg-sky-400 shadow-sm shadow-sky-500/40">
                  <span>Sign up</span>
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

