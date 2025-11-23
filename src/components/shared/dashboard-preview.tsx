import { X, Copy, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute inset-x-6 -inset-y-6 bg-sky-500/20 blur-3xl opacity-60" />
      <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm shadow-xl shadow-sky-900/40 overflow-hidden">
        {/* Mini top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-medium tracking-tight">Reply generator</span>
          </div>
          <span className="text-[0.65rem] text-slate-400">
            Profile: <span className="text-slate-100">Lena · Product Lead</span>
          </span>
        </div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] p-4 sm:p-5">
          {/* Left: input */}
          <div className="space-y-3">
            <label className="text-[0.7rem] font-medium text-slate-300 flex items-center justify-between">
              Incoming message
              <span className="text-[0.65rem] text-slate-500">Inbox · Email</span>
            </label>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2">
              <div className="text-xs text-slate-200">
                &ldquo;Can you send an update on the roadmap before tomorrow&apos;s exec review?
                Keep it concise but cover the main risks.&rdquo;
              </div>
              <div className="flex justify-between items-center text-[0.65rem] text-slate-500">
                <span>Detected: formal · concise · high priority</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[0.65rem]">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                &ldquo;Boss · strategic&rdquo;
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 px-2 py-1">
                Formal
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 px-2 py-1">
                Short replies
              </span>
            </div>
          </div>

          {/* Right: output */}
          <div className="space-y-2 mt-[-5px]">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] font-medium text-slate-300">
                Suggested reply
              </span>
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-2 py-0.5 text-[0.65rem] text-slate-300">
                Length:
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-900 rounded-full px-1.5 py-0.5">
                  Short
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2">
              <p className="text-xs text-slate-100">
                Here&apos;s a concise update on the roadmap for tomorrow&apos;s review. The main
                risks this quarter are dependency on the billing refactor and limited design
                capacity for the new onboarding. I&apos;ll highlight mitigations and timelines in
                the deck so you can speak to tradeoffs clearly.
              </p>
              <div className="flex flex-wrap justify-between gap-2 items-center text-[0.65rem]">
                <div className="inline-flex items-center gap-2 text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Formal
                  </span>
                  <span>Aligned to: Lena</span>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-950 px-2 py-1 hover:bg-slate-200 h-auto text-[0.65rem] font-medium"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-1 rounded-full border-slate-700 bg-slate-900 text-slate-100 px-2 py-1 hover:border-slate-500 hover:bg-slate-800 h-auto text-[0.65rem] font-medium"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[0.65rem] text-slate-400">
              <span>Daily credits: 42 / 50 used</span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-8 rounded-full bg-slate-800 overflow-hidden">
                  <span className="block h-full w-3/4 bg-sky-500" />
                </span>
                <span>84%</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

