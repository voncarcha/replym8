import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AddProfile } from "@/components/shared/add-profile";

export default function ProfilesPage() {
  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-foreground">
            Profiles
          </h3>
          <p className="text-sm sm:text-sm text-muted-foreground">
            Personalize replies per person, team, or account.
          </p>
        </div>
        <AddProfile
          trigger={
            <Button className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 text-white dark:text-slate-950 text-sm font-medium tracking-tight px-3 py-1.5 hover:bg-sky-400 h-auto">
              <Plus className="h-3.5 w-3.5" />
              Add Profile
            </Button>
          }
        />
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-4 space-y-3 overflow-y-auto">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 text-sm pt-4">
          <button className="inline-flex items-center gap-1.5 rounded-full bg-muted text-foreground px-2.5 py-1">
            All
            <span className="text-[0.75rem] text-muted-foreground">12</span>
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card text-muted-foreground px-2.5 py-1 hover:bg-muted">
            Clients
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card text-muted-foreground px-2.5 py-1 hover:bg-muted">
            Leads
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card text-muted-foreground px-2.5 py-1 hover:bg-muted">
            Personal
          </button>
        </div>

        {/* Profile list */}
        <div className="space-y-2 flex flex-col gap-1">
          <Link href="/dashboard/profiles/lena">
            <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                  LP
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      Lena · Product Lead
                    </span>
                    <span className="text-[0.8125rem] text-muted-foreground">Boss</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-[0.8125rem] text-foreground">
                    <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                      Formal
                    </span>
                    <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                      Short replies
                    </span>
                    <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                      No emojis
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-end sm:items-center justify-between sm:flex-col sm:justify-between gap-2 w-full sm:w-auto">
                <div className="text-[0.8125rem] text-muted-foreground">
                  Last updated <span className="text-foreground">2h ago</span>
                </div>
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
                >
                  View details
                </Button>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/profiles/acme">
            <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                  AC
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      ACME · Exec team
                    </span>
                    <span className="text-[0.8125rem] text-muted-foreground">Client group</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-[0.8125rem] text-foreground">
                    <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                      Data-first
                    </span>
                    <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                      Weekly status
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-end sm:items-center justify-between sm:flex-col sm:justify-between gap-2 w-full sm:w-auto">
                <div className="text-[0.8125rem] text-muted-foreground">
                  Last updated <span className="text-foreground">1d ago</span>
                </div>
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
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

