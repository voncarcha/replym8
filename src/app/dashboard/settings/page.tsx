import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-slate-900">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-slate-50">
            Settings &amp; plan
          </h3>
          <p className="text-sm sm:text-sm text-slate-400">
            Manage your account, plan, and default reply behavior.
          </p>
        </div>
        <Button
          variant="outline"
          className="inline-flex items-center gap-1.5 rounded-lg border-slate-800 bg-slate-950 text-sm text-slate-100 px-3 py-1.5 hover:border-slate-600 hover:bg-slate-900 h-auto"
        >
          <SettingsIcon className="h-3.5 w-3.5" />
          Account
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] overflow-y-auto pt-4">
        {/* Left: preferences */}
        <div className="space-y-3">
          <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-3 sm:p-4 space-y-3">
            <h4 className="text-sm font-medium tracking-tight text-slate-100">
              Default reply settings
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 text-[0.9375rem]">
              <div className="space-y-1.5">
                <label className="block text-slate-300">Default length</label>
                <select className="w-full rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500">
                  <option>Short</option>
                  <option>Medium</option>
                  <option>Long</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-300">Fallback tone</label>
                <select className="w-full rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500">
                  <option>Neutral</option>
                  <option>More formal</option>
                  <option>More casual</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5 text-[0.9375rem]">
              <label className="block text-slate-300">Signature (optional)</label>
              <textarea
                className="w-full rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-50 px-2.5 py-1.5 min-h-[4rem] focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Best,
Your name"
              />
              <p className="text-[0.8125rem] text-slate-500">
                ReplyM8 can optionally append this to generated replies.
              </p>
            </div>
            <Button className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 text-slate-950 text-sm font-medium px-3 py-1.5 hover:bg-sky-400 h-auto">
              Save defaults
            </Button>
          </Card>

          <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-3 sm:p-4 space-y-2 text-[0.9375rem]">
            <div className="flex items-center justify-between">
              <span className="text-slate-100 font-medium">Data &amp; privacy</span>
              <button className="text-[0.8125rem] text-sky-400 hover:text-sky-300">
                Open policy
              </button>
            </div>
            <p className="text-slate-400">
              Your messages and profiles stay private to your account by default. You can export or
              delete your data at any time from this panel.
            </p>
          </Card>
        </div>

        {/* Right: plan summary */}
        <div className="space-y-3">
          <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium tracking-tight text-slate-100">
                Plan overview
              </h4>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[0.8125rem] text-emerald-300">
                Active · Pro
              </span>
            </div>
            <div className="space-y-2 text-[0.9375rem] text-slate-300">
              <div className="flex items-center justify-between">
                <span>Reply limit</span>
                <span>80 / day</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Profiles</span>
                <span>Unlimited</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Next billing</span>
                <span>Mar 28, 2025</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border-slate-800 bg-slate-950 text-sm text-slate-100 px-3 py-1.5 hover:border-sky-500/70 hover:bg-slate-900 h-auto"
            >
              Manage billing
            </Button>
          </Card>

          <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-3 sm:p-4 space-y-2 text-[0.9375rem]">
            <h4 className="text-sm font-medium tracking-tight text-slate-100">
              Usage this week
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Replies generated</span>
                <span>214</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-sky-500 to-emerald-400" />
              </div>
              <p className="text-[0.8125rem] text-slate-500">
                You&apos;re in the top 15% of ReplyM8 power users this week.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

