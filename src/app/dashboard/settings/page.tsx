import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-foreground">
            Settings &amp; plan
          </h3>
          <p className="text-sm sm:text-sm text-muted-foreground">
            Manage your account, plan, and default reply behavior.
          </p>
        </div>
        <Button
          variant="outline"
          className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-3 py-1.5 hover:bg-muted h-auto"
        >
          <SettingsIcon className="h-3.5 w-3.5" />
          Account
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] overflow-y-auto pt-4">
        {/* Left: preferences */}
        <div className="space-y-3">
          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
            <h4 className="text-sm font-medium tracking-tight text-foreground">
              Default reply settings
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 text-[0.9375rem]">
              <div className="space-y-1.5">
                <label className="block text-muted-foreground">
                  Default length
                </label>
                <select className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500">
                  <option>Short</option>
                  <option>Medium</option>
                  <option>Long</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-muted-foreground">
                  Fallback tone
                </label>
                <select className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500">
                  <option>Neutral</option>
                  <option>More formal</option>
                  <option>More casual</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5 text-[0.9375rem]">
              <label className="block text-muted-foreground">
                Signature (optional)
              </label>
              <textarea
                className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 min-h-16 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Best,
Your name"
              />
              <p className="text-[0.8125rem] text-muted-foreground/70">
                ReplyM8 can optionally append this to generated replies.
              </p>
            </div>
            <Button className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 text-white text-sm font-medium px-3 py-1.5 hover:bg-sky-400 h-auto">
              Save defaults
            </Button>
          </Card>

          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-2 text-[0.9375rem]">
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">
                Data &amp; privacy
              </span>
              <button className="text-[0.8125rem] text-sky-400 hover:text-sky-300 cursor-pointer">
                Open policy
              </button>
            </div>
            <p className="text-muted-foreground">
              Your messages and profiles stay private to your account by
              default. You can export or delete your data at any time from this
              panel.
            </p>
          </Card>
        </div>

        {/* Right: plan summary */}
        <div className="space-y-3">
          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium tracking-tight text-foreground">
                Plan overview
              </h4>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[0.8125rem] text-emerald-300">
                Active · Pro
              </span>
            </div>
            <div className="space-y-2 text-[0.9375rem] text-foreground">
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
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-3 py-1.5 hover:border-sky-500/70 hover:bg-muted h-auto"
            >
              Manage billing
            </Button>
          </Card>

          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-2 text-[0.9375rem]">
            <h4 className="text-sm font-medium tracking-tight text-foreground">
              Usage this week
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-foreground">
                <span>Replies generated</span>
                <span>214</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-4/5 bg-linear-to-r from-sky-500 to-emerald-400" />
              </div>
              <p className="text-[0.8125rem] text-muted-foreground/70">
                You&apos;re in the top 15% of ReplyM8 power users this week.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
