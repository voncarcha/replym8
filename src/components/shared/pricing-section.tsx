import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              Pricing that scales with your conversations.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-xl">
              Start free, then upgrade when ReplyM8 becomes part of your daily inbox routine.
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-border bg-card/80 text-[0.7rem] text-foreground px-2 py-1">
            <button className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium cursor-pointer">
              Monthly
            </button>
            <button className="px-2 py-0.5 text-muted-foreground cursor-pointer">
              Yearly <span className="ml-0.5 text-emerald-400">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* Main plan */}
          <div className="relative rounded-2xl border border-sky-500/50 bg-linear-to-br from-background via-background to-card/90 p-4 sm:p-6 shadow-lg shadow-sky-900/60 dark:shadow-sky-900/60">
            <div className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-sky-500 text-white text-[0.65rem] font-medium tracking-tight px-2.5 py-0.5">
              Most popular
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                    Pro
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    For people who live in their inbox or DMs.
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                      $5
                    </span>
                    <span className="text-xs text-muted-foreground">/month</span>
                  </div>
                  <div className="text-[0.65rem] text-muted-foreground mt-0.5">
                    Billed monthly · cancel anytime
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Up to 80 AI replies / day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Unlimited recipient profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Priority processing for long threads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Export profiles for team alignment</span>
                </div>
              </div>
              <Button className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium tracking-tight px-4 py-2.5 hover:bg-primary/90">
                Get started with Pro
              </Button>
              <div className="text-[0.65rem] text-muted-foreground mt-2">
                Try free for 7 days. No credit card required.
              </div>
            </div>
          </div>

          {/* Side plans */}
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card/90 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-medium tracking-tight text-foreground">
                    Starter
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    For testing ReplyM8 in your workflow.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                    Free
                  </div>
                  <div className="text-[0.65rem] text-muted-foreground">No card</div>
                </div>
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>· 15 AI replies / day</li>
                <li>· Up to 5 recipient profiles</li>
                <li>· Core generator &amp; uploads</li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card/90 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-medium tracking-tight text-foreground">
                    Teams
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Align messaging across sales, CS, and founders.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                    Custom
                  </div>
                  <div className="text-[0.65rem] text-muted-foreground">Volume pricing</div>
                </div>
              </div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>· Shared profile library</li>
                <li>· Centralized tone presets</li>
                <li>· Admin controls &amp; SSO</li>
              </ul>
              <Button
                variant="outline"
                className="w-full inline-flex items-center justify-center rounded-lg border-border bg-card text-xs sm:text-sm text-foreground px-4 py-2.5 hover:bg-muted"
              >
                Talk to us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

