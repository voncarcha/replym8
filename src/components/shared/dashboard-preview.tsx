import { Copy, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute inset-x-6 -inset-y-6 bg-sky-500/20 blur-3xl opacity-60" />
      <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-xl shadow-sky-900/40 dark:shadow-sky-900/40 overflow-hidden">
        {/* Mini top bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-medium tracking-tight">Reply generator</span>
          </div>
          <span className="text-[0.65rem] text-muted-foreground">
            Profile: <span className="text-foreground">Lena · Product Lead</span>
          </span>
        </div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] p-4 sm:p-5">
          {/* Left: input */}
          <div className="space-y-3">
            <label className="text-[0.7rem] font-medium text-muted-foreground flex items-center justify-between">
              Incoming message
              <span className="text-[0.65rem] text-muted-foreground/70">Inbox · Email</span>
            </label>
            <div className="rounded-xl border border-border bg-muted/80 p-3 space-y-2">
              <div className="text-xs text-foreground">
                &ldquo;Can you send an update on the roadmap before tomorrow&apos;s exec review?
                Keep it concise but cover the main risks.&rdquo;
              </div>
              <div className="flex justify-between items-center text-[0.65rem] text-muted-foreground/70">
                <span>Detected: formal · concise · high priority</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[0.65rem]">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 border border-border text-foreground px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                &ldquo;Boss · strategic&rdquo;
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 border border-border text-foreground px-2 py-1">
                Formal
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/80 border border-border text-foreground px-2 py-1">
                Short replies
              </span>
            </div>
          </div>

          {/* Right: output */}
          <div className="space-y-2 mt-[-5px]">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] font-medium text-muted-foreground">
                Suggested reply
              </span>
              <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/80 px-2 py-0.5 text-[0.65rem] text-foreground">
                Length:
                <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                  Short
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/80 p-3 space-y-2">
              <p className="text-xs text-foreground">
                Here&apos;s a concise update on the roadmap for tomorrow&apos;s review. The main
                risks this quarter are dependency on the billing refactor and limited design
                capacity for the new onboarding. I&apos;ll highlight mitigations and timelines in
                the deck so you can speak to tradeoffs clearly.
              </p>
              <div className="flex flex-wrap justify-between gap-2 items-center text-[0.65rem]">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Formal
                  </span>
                  <span>Aligned to: Lena</span>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-1 hover:bg-primary/90 h-auto text-[0.65rem] font-medium"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-1 rounded-full border-border bg-card text-foreground px-2 py-1 hover:bg-muted h-auto text-[0.65rem] font-medium"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground">
              <span>Daily credits: 42 / 50 used</span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-8 rounded-full bg-muted overflow-hidden">
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

