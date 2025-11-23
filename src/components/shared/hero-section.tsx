import { ArrowUpRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  return (
    <section className="border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-10 sm:py-14 lg:py-20 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
        {/* Hero Left */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 text-[0.7rem] sm:text-xs text-slate-300 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>AI that remembers how each person likes to talk</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-50">
              Replies that sound like you,
              <br className="hidden sm:block" /> for every person you talk to.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl">
              ReplyM8 builds a living profile for each recipient—tone,
              preferences, and past context—so every email, chat, or DM feels
              personal and on point in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 text-slate-950 text-sm font-medium tracking-tight px-4 sm:px-5 py-2.5 hover:bg-sky-400 shadow-sm shadow-sky-500/40">
              <span>Generate smarter replies</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-slate-700 bg-slate-950 text-sm text-slate-100 px-4 sm:px-5 py-2.5 hover:border-slate-500 hover:bg-slate-900"
            >
              <Play className="h-4 w-4 text-slate-300" />
              <span>Watch 60s demo</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
            <div className="flex -space-x-2">
              <div className="h-6 w-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[0.6rem]">
                A
              </div>
              <div className="h-6 w-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[0.6rem]">
                B
              </div>
              <div className="h-6 w-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[0.6rem]">
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
