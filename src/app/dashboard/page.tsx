import { Card } from "@/components/ui/card";
import { Plus, Sparkles, Upload } from "lucide-react";
import Link from "next/link";

export default function DashboardHomePage() {
  return (
    <>
      {/* Header */}
      <div className="border-b border-slate-900 px-4 sm:px-5 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-slate-50">
            Home
          </h3>
          <p className="text-sm sm:text-sm text-slate-400">
            At a glance: usage, quick actions, and recent profiles.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-slate-300">
          <span className="hidden sm:inline text-slate-400">Today</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
        {/* Quick actions */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/dashboard/profiles/new">
            <Card className="group rounded-xl border-slate-800 bg-slate-950/80 hover:border-sky-500/70 hover:bg-slate-900/90 transition-colors p-3 sm:p-4 flex flex-col gap-3 text-left cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-50">
                  <div className="h-6 w-6 rounded-lg bg-sky-500/10 border border-sky-400/60 flex items-center justify-center">
                    <Plus className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  Create profile
                </div>
                <span className="text-[0.8125rem] text-slate-400">
                  Profiles
                </span>
              </div>
              <p className="text-sm sm:text-sm text-slate-300">
                Add a new recipient with tone, preferences, and conversation
                history.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/generator">
            <Card className="group rounded-xl border-slate-800 bg-slate-950/80 hover:border-sky-500/70 hover:bg-slate-900/90 transition-colors p-3 sm:p-4 flex flex-col gap-3 text-left cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-50">
                  <div className="h-6 w-6 rounded-lg bg-sky-500/10 border border-sky-400/60 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  Generate reply
                </div>
                <span className="text-[0.8125rem] text-slate-400">
                  Generator
                </span>
              </div>
              <p className="text-sm sm:text-sm text-slate-300">
                Paste a message, pick a profile, and get a ready-to-send reply.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/conversations">
            <Card className="group rounded-xl border-slate-800 bg-slate-950/80 hover:border-sky-500/70 hover:bg-slate-900/90 transition-colors p-3 sm:p-4 flex flex-col gap-3 text-left cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-50">
                  <div className="h-6 w-6 rounded-lg bg-sky-500/10 border border-sky-400/60 flex items-center justify-center">
                    <Upload className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  Upload conversation
                </div>
                <span className="text-[0.8125rem] text-slate-400">
                  Conversations
                </span>
              </div>
              <p className="text-sm sm:text-sm text-slate-300">
                Drop in screenshots or text threads to enrich a profile.
              </p>
            </Card>
          </Link>
        </div>

        {/* Stats + recent profiles */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Stats */}
          <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium tracking-tight text-slate-100">
                  Today&apos;s usage
                </h4>
                <p className="text-sm text-slate-400">
                  How ReplyM8 is helping you right now.
                </p>
              </div>
              <span className="text-[0.8125rem] text-slate-400">
                Updated just now
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <div className="text-sm text-slate-300">Replies</div>
                <div className="text-2xl font-semibold tracking-tight text-slate-50 mt-1">
                  38
                </div>
                <div className="text-[0.8125rem] text-emerald-400 mt-0.5">
                  +26 vs avg
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <div className="text-sm text-slate-300">Profiles used</div>
                <div className="text-2xl font-semibold tracking-tight text-slate-50 mt-1">
                  9
                </div>
                <div className="text-[0.8125rem] text-slate-400 mt-0.5">
                  Out of 12 total
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <div className="text-sm text-slate-300">Avg length</div>
                <div className="text-2xl font-semibold tracking-tight text-slate-50 mt-1">
                  Short
                </div>
                <div className="text-[0.8125rem] text-slate-400 mt-0.5">
                  65 words
                </div>
              </div>
            </div>
          </Card>

          {/* Recent profiles */}
          <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium tracking-tight text-slate-100">
                Recent profiles
              </h4>
              <Link
                href="/dashboard/profiles"
                className="text-sm text-sky-400 hover:text-sky-300"
              >
                View all
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              <Link href="/dashboard/profiles/lena">
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 hover:bg-slate-900 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[0.8125rem]">
                      LP
                    </div>
                    <div>
                      <div className="text-slate-100">Lena · Product Lead</div>
                      <div className="text-[0.75rem] text-slate-400">
                        Formal · No emojis · Short
                      </div>
                    </div>
                  </div>
                  <span className="text-[0.75rem] text-slate-400">
                    Updated 2h ago
                  </span>
                </div>
              </Link>
              <Link href="/dashboard/profiles/acme">
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-2 hover:bg-slate-900 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[0.8125rem]">
                      AC
                    </div>
                    <div>
                      <div className="text-slate-100">ACME · Customer team</div>
                      <div className="text-[0.75rem] text-slate-400">
                        Group · Weekly reports
                      </div>
                    </div>
                  </div>
                  <span className="text-[0.75rem] text-slate-400">
                    Updated 1d ago
                  </span>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
