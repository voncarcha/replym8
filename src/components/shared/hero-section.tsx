import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./dashboard-preview";

export async function HeroSection() {
  const user = await currentUser();
  const redirectUrl = user ? "/dashboard" : "/sign-in";
  return (
    <section className="border-b border-border bg-linear-to-b from-background via-background to-background">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-10 sm:py-14 lg:py-20 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
        {/* Hero Left */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 text-[0.7rem] sm:text-xs text-muted-foreground px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>AI that remembers how each person likes to talk</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
              Replies that sound like you,
              <br className="hidden sm:block" /> for every person you talk to.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              ReplyM8 builds a living profile for each recipient—tone,
              preferences, and past context—so every email, chat, or DM feels
              personal and on point in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button
              asChild
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 text-white text-sm font-medium tracking-tight px-4 sm:px-5 py-2.5 hover:bg-sky-400 shadow-sm shadow-sky-500/40"
            >
              <Link href={redirectUrl}>
              <span>Generate smarter replies</span>
              <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            {/* <Button
              variant="outline"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-border bg-card text-sm text-foreground px-4 sm:px-5 py-2.5 hover:bg-muted"
            >
              <Play className="h-4 w-4 text-muted-foreground" />
              <span>Watch 60s demo</span>
            </Button> */}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              <div className="h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center text-[0.6rem] text-foreground">
                A
              </div>
              <div className="h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center text-[0.6rem] text-foreground">
                B
              </div>
              <div className="h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center text-[0.6rem] text-foreground">
                C
              </div>
            </div>
            <span>Trusted by founders, sales teams, and inbox-zero fans.</span>
          </div>
        </div>

        {/* Hero Right: Dashboard Preview */}
        <DashboardPreview />
      </div>
    </section>
  );
}
