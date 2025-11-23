import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-50">
              Pricing that scales with your conversations.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-xl">
              Start free, then upgrade when ReplyM8 becomes part of your daily inbox routine.
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/80 text-[0.7rem] text-slate-300 px-2 py-1">
            <button className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-950 font-medium">
              Monthly
            </button>
            <button className="px-2 py-0.5 text-slate-400">
              Yearly <span className="ml-0.5 text-emerald-400">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* Main plan */}
          <div className="relative rounded-2xl border border-sky-500/50 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/90 p-4 sm:p-6 shadow-lg shadow-sky-900/60">
            <div className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-sky-500 text-slate-950 text-[0.65rem] font-medium tracking-tight px-2.5 py-0.5">
              Most popular
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-50">
                    Pro
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    For people who live in their inbox or DMs.
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
                      $19
                    </span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>
                  <div className="text-[0.65rem] text-slate-400 mt-0.5">
                    Billed monthly · cancel anytime
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-slate-200">
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
              <Button className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-slate-50 text-slate-950 text-sm font-medium tracking-tight px-4 py-2.5 hover:bg-slate-200">
                Get started with Pro
              </Button>
              <div className="text-[0.65rem] text-slate-400 mt-2">
                Try free for 7 days. No credit card required.
              </div>
            </div>
          </div>

          {/* Side plans */}
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-medium tracking-tight text-slate-50">
                    Starter
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    For testing ReplyM8 in your workflow.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-base sm:text-lg font-semibold tracking-tight text-slate-50">
                    Free
                  </div>
                  <div className="text-[0.65rem] text-slate-400">No card</div>
                </div>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>· 15 AI replies / day</li>
                <li>· Up to 10 recipient profiles</li>
                <li>· Core generator &amp; uploads</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-medium tracking-tight text-slate-50">
                    Teams
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Align messaging across sales, CS, and founders.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-base sm:text-lg font-semibold tracking-tight text-slate-50">
                    Custom
                  </div>
                  <div className="text-[0.65rem] text-slate-400">Volume pricing</div>
                </div>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>· Shared profile library</li>
                <li>· Centralized tone presets</li>
                <li>· Admin controls &amp; SSO</li>
              </ul>
              <Button
                variant="outline"
                className="w-full inline-flex items-center justify-center rounded-lg border-slate-700 bg-slate-950 text-xs sm:text-sm text-slate-100 px-4 py-2.5 hover:border-slate-500 hover:bg-slate-900"
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

