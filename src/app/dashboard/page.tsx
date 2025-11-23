import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Sparkles, Upload } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function DashboardHomePage() {
  const user = await currentUser();

  // AuthGuard ensures user exists, but TypeScript needs this check
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-5 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-foreground">
            Home
          </h3>
          <p className="text-sm sm:text-sm text-muted-foreground">
            At a glance: usage, quick actions, and recent profiles.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-foreground">
          <span className="hidden sm:inline text-muted-foreground">Today</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-4 sm:px-5 py-4">
        <Card className="rounded-xl border-border bg-card/80">
          <CardHeader>
            <CardTitle className="text-sm font-medium tracking-tight text-foreground">
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-border bg-white">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.firstName || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-lg font-semibold">
                  {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0].toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-base font-medium text-foreground">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.firstName || "User"}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
        {/* Quick actions */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/dashboard/profiles/new">
            <Card className="group rounded-xl border-border bg-card/80 hover:border-sky-500/70 hover:bg-muted/90 transition-colors p-3 sm:p-4 flex flex-col gap-3 text-left cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="h-6 w-6 rounded-lg bg-sky-500/10 border border-sky-400/60 flex items-center justify-center">
                    <Plus className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  Create profile
                </div>
                <span className="text-[0.8125rem] text-muted-foreground">
                  Profiles
                </span>
              </div>
              <p className="text-sm sm:text-sm text-muted-foreground">
                Add a new recipient with tone, preferences, and conversation
                history.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/generator">
            <Card className="group rounded-xl border-border bg-card/80 hover:border-sky-500/70 hover:bg-muted/90 transition-colors p-3 sm:p-4 flex flex-col gap-3 text-left cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="h-6 w-6 rounded-lg bg-sky-500/10 border border-sky-400/60 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  Generate reply
                </div>
                <span className="text-[0.8125rem] text-muted-foreground">
                  Generator
                </span>
              </div>
              <p className="text-sm sm:text-sm text-muted-foreground">
                Paste a message, pick a profile, and get a ready-to-send reply.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/conversations">
            <Card className="group rounded-xl border-border bg-card/80 hover:border-sky-500/70 hover:bg-muted/90 transition-colors p-3 sm:p-4 flex flex-col gap-3 text-left cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="h-6 w-6 rounded-lg bg-sky-500/10 border border-sky-400/60 flex items-center justify-center">
                    <Upload className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  Upload conversation
                </div>
                <span className="text-[0.8125rem] text-muted-foreground">
                  Conversations
                </span>
              </div>
              <p className="text-sm sm:text-sm text-muted-foreground">
                Drop in screenshots or text threads to enrich a profile.
              </p>
            </Card>
          </Link>
        </div>

        {/* Stats + recent profiles */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Stats */}
          <Card className="rounded-xl border-border bg-card/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium tracking-tight text-foreground">
                  Today&apos;s usage
                </h4>
                <p className="text-sm text-muted-foreground">
                  How ReplyM8 is helping you right now.
                </p>
              </div>
              <span className="text-[0.8125rem] text-muted-foreground">
                Updated just now
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-sm text-muted-foreground">Replies</div>
                <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
                  38
                </div>
                <div className="text-[0.8125rem] text-emerald-400 mt-0.5">
                  +26 vs avg
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-sm text-muted-foreground">Profiles used</div>
                <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
                  9
                </div>
                <div className="text-[0.8125rem] text-muted-foreground mt-0.5">
                  Out of 12 total
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="text-sm text-muted-foreground">Avg length</div>
                <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
                  Short
                </div>
                <div className="text-[0.8125rem] text-muted-foreground mt-0.5">
                  65 words
                </div>
              </div>
            </div>
          </Card>

          {/* Recent profiles */}
          <Card className="rounded-xl border-border bg-card/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium tracking-tight text-foreground">
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
                <div className="flex items-center justify-between rounded-lg border border-border bg-background px-2.5 py-2 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[0.8125rem] text-foreground">
                      LP
                    </div>
                    <div>
                      <div className="text-foreground">Lena · Product Lead</div>
                      <div className="text-[0.75rem] text-muted-foreground">
                        Formal · No emojis · Short
                      </div>
                    </div>
                  </div>
                  <span className="text-[0.75rem] text-muted-foreground">
                    Updated 2h ago
                  </span>
                </div>
              </Link>
              <Link href="/dashboard/profiles/acme">
                <div className="flex items-center justify-between rounded-lg border border-border bg-background px-2.5 py-2 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[0.8125rem] text-foreground">
                      AC
                    </div>
                    <div>
                      <div className="text-foreground">ACME · Customer team</div>
                      <div className="text-[0.75rem] text-muted-foreground">
                        Group · Weekly reports
                      </div>
                    </div>
                  </div>
                  <span className="text-[0.75rem] text-muted-foreground">
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
