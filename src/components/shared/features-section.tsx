import { Card, CardContent } from "@/components/ui/card";
import { Box, ArrowLeftRight, TrendingUp } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-slate-900">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-50">
              Built around people, not just messages.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-xl">
              ReplyM8 remembers how each recipient prefers to communicate, and quietly shapes every
              reply to match.
            </p>
          </div>
          <div className="flex gap-2 text-[0.7rem] text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Inbox-safe
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950 px-2 py-1">
              No training required
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {/* Feature 1 */}
          <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-4 sm:p-5 flex flex-col gap-3">
            <div className="inline-flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-100">
                <div className="h-7 w-7 rounded-lg bg-sky-500/10 border border-sky-500/40 flex items-center justify-center">
                  <Box className="h-3.5 w-3.5 text-sky-400" />
                </div>
                Recipient profiles
              </div>
              <span className="text-[0.65rem] text-slate-400">Profiles</span>
            </div>
            <p className="text-sm text-slate-300">
              Capture tone, formality, and preferences for each client, lead, or teammate.
              ReplyM8 keeps them up to date from real conversations.
            </p>
            <div className="mt-auto rounded-lg border border-slate-800 bg-slate-900/70 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-200">Lena · Product Lead</span>
                <span className="inline-flex items-center gap-1 text-[0.65rem] text-slate-400">
                  Formal
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[0.65rem] text-slate-300">
                <span className="rounded-full bg-slate-950 px-2 py-0.5 border border-slate-800">
                  Short replies
                </span>
                <span className="rounded-full bg-slate-950 px-2 py-0.5 border border-slate-800">
                  No emojis
                </span>
                <span className="rounded-full bg-slate-950 px-2 py-0.5 border border-slate-800">
                  Morning preferred
                </span>
              </div>
            </div>
          </Card>

          {/* Feature 2 */}
          <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-4 sm:p-5 flex flex-col gap-3">
            <div className="inline-flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-100">
                <div className="h-7 w-7 rounded-lg bg-sky-500/10 border border-sky-500/40 flex items-center justify-center">
                  <ArrowLeftRight className="h-3.5 w-3.5 text-sky-400" />
                </div>
                Context-aware replies
              </div>
              <span className="text-[0.65rem] text-slate-400">Generator</span>
            </div>
            <p className="text-sm text-slate-300">
              Paste a message or upload a thread. ReplyM8 reads the context and personalizes your
              response to the right tone and length.
            </p>
            <div className="mt-auto rounded-lg border border-slate-800 bg-slate-900/70 p-3 space-y-2 text-[0.75rem]">
              <div className="text-slate-400">&ldquo;Hey, can we push our check-in?&rdquo;</div>
              <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-2 mt-1">
                <span className="block text-slate-200">
                  Absolutely—happy to move it. What works best for you tomorrow afternoon?
                </span>
                <div className="mt-1 flex justify-between items-center text-[0.65rem] text-slate-400">
                  <span>Casual · friendly</span>
                  <span>Profile: Alex · friend</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Feature 3 */}
          <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-4 sm:p-5 flex flex-col gap-3">
            <div className="inline-flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-100">
                <div className="h-7 w-7 rounded-lg bg-sky-500/10 border border-sky-500/40 flex items-center justify-center">
                  <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
                </div>
                Credits &amp; control
              </div>
              <span className="text-[0.65rem] text-slate-400">Usage</span>
            </div>
            <p className="text-sm text-slate-300">
              See how many replies you&apos;ve generated today, where profiles are used most, and
              stay within your plan—no surprises.
            </p>
            <div className="mt-auto space-y-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 space-y-2 text-[0.75rem]">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Daily reply usage</span>
                  <span className="text-slate-400">38 / 50</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-sky-500 to-emerald-400" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[0.65rem] text-slate-400">
                <span>Most used: Client profiles</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-400" /> Sales
                  <span className="h-2 w-2 rounded-full bg-emerald-400 ml-2" /> Support
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

