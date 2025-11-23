import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProfilesPage() {
  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-slate-900">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-slate-50">
            Profiles
          </h3>
          <p className="text-sm sm:text-sm text-slate-400">
            Personalize replies per person, team, or account.
          </p>
        </div>
        <Button className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 text-slate-950 text-sm font-medium tracking-tight px-3 py-1.5 hover:bg-sky-400 h-auto">
          <Plus className="h-3.5 w-3.5" />
          Add Profile
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-4 space-y-3 overflow-y-auto">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 text-sm pt-4">
          <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-slate-100 px-2.5 py-1">
            All
            <span className="text-[0.75rem] text-slate-400">12</span>
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 text-slate-300 px-2.5 py-1 hover:bg-slate-900">
            Clients
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 text-slate-300 px-2.5 py-1 hover:bg-slate-900">
            Leads
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 text-slate-300 px-2.5 py-1 hover:bg-slate-900">
            Personal
          </button>
        </div>

        {/* Profile list */}
        <div className="space-y-2">
          <Link href="/dashboard/profiles/lena">
            <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium">
                  LP
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-50">
                      Lena · Product Lead
                    </span>
                    <span className="text-[0.8125rem] text-slate-400">Boss</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-[0.8125rem] text-slate-300">
                    <span className="rounded-full bg-slate-900/80 border border-slate-800 px-2 py-0.5">
                      Formal
                    </span>
                    <span className="rounded-full bg-slate-900/80 border border-slate-800 px-2 py-0.5">
                      Short replies
                    </span>
                    <span className="rounded-full bg-slate-900/80 border border-slate-800 px-2 py-0.5">
                      No emojis
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-end sm:items-center justify-between sm:flex-col sm:justify-between gap-2 w-full sm:w-auto">
                <div className="text-[0.8125rem] text-slate-400">
                  Last updated <span className="text-slate-200">2h ago</span>
                </div>
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center rounded-lg border-slate-800 bg-slate-950 text-sm text-slate-100 px-2.5 py-1.5 hover:border-slate-600 hover:bg-slate-900 h-auto"
                >
                  View details
                </Button>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/profiles/acme">
            <Card className="rounded-xl border-slate-800 bg-slate-950/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium">
                  AC
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-50">
                      ACME · Exec team
                    </span>
                    <span className="text-[0.8125rem] text-slate-400">Client group</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-[0.8125rem] text-slate-300">
                    <span className="rounded-full bg-slate-900/80 border border-slate-800 px-2 py-0.5">
                      Data-first
                    </span>
                    <span className="rounded-full bg-slate-900/80 border border-slate-800 px-2 py-0.5">
                      Weekly status
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-end sm:items-center justify-between sm:flex-col sm:justify-between gap-2 w-full sm:w-auto">
                <div className="text-[0.8125rem] text-slate-400">
                  Last updated <span className="text-slate-200">1d ago</span>
                </div>
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center rounded-lg border-slate-800 bg-slate-950 text-sm text-slate-100 px-2.5 py-1.5 hover:border-slate-600 hover:bg-slate-900 h-auto"
                >
                  View details
                </Button>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}

