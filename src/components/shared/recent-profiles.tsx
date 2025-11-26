import { Card } from "@/components/ui/card";
import { Profile } from "@/types";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/date-utils";

interface RecentProfilesProps {
  profiles: Profile[];
}

function getInitials(name: string): string {
  const parts = name.split(/[\s·]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatProfileType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function RecentProfiles({ profiles }: RecentProfilesProps) {
  if (profiles.length === 0) {
    return (
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
        <div className="text-sm text-muted-foreground text-center py-4">
          No profiles yet. Create your first profile to get started.
        </div>
      </Card>
    );
  }

  return (
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
      <div className="space-y-2 text-sm flex flex-col gap-1">
        {profiles.map((profile) => {
          const createdAt = new Date(profile.created_at);
          const timeAgo = formatTimeAgo(createdAt);

          return (
            <Link key={profile.id} href={`/dashboard/profiles/${profile.id}`}>
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-2.5 py-2 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[0.8125rem] text-foreground">
                    {getInitials(profile.name)}
                  </div>
                  <div>
                    <div className="text-foreground">{profile.name}</div>
                    <div className="text-[0.75rem] text-muted-foreground">
                      {formatProfileType(profile.type)} · {profile.relationship_type}
                    </div>
                  </div>
                </div>
                <span className="text-[0.75rem] text-muted-foreground">Created {timeAgo}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

