import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ProfileWithMembers } from "@/app/actions/profile";
import { formatRelativeTime, getInitials } from "@/lib/utils";

interface ProfileListProps {
  profiles: ProfileWithMembers[];
  allProfilesCount: number;
}

export function ProfileList({ profiles, allProfilesCount }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="pt-8 pb-12 text-center">
        <div className="mx-auto max-w-sm">
          <p className="text-sm text-muted-foreground mb-4">
            {allProfilesCount === 0
              ? "No profiles yet. Create your first profile to get started."
              : "No profiles match the selected filter."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 flex flex-col gap-1">
      {profiles.map((profile) => {
        const initials = getInitials(profile.name);
        const relationshipType = profile.relationship_type || "Other";
        const tags = profile.tone_preferences?.tags || [];
        const formality = profile.tone_preferences?.formality;

        // Build display name
        let displayName = profile.name;
        if (
          profile.type === "group" &&
          profile.members &&
          profile.members.length > 0
        ) {
          const memberNames = profile.members
            .slice(0, 2)
            .map((m) => m.name)
            .join(", ");
          if (profile.members.length > 2) {
            displayName = `${profile.name} · ${memberNames} +${profile.members.length - 2}`;
          } else {
            displayName = `${profile.name} · ${memberNames}`;
          }
        }

        return (
          <Link key={profile.id} href={`/dashboard/profiles/${profile.id}`}>
            <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      {displayName}
                    </span>
                    <span className="text-[0.8125rem] text-muted-foreground">
                      {relationshipType}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-[0.8125rem] text-foreground">
                    {formality && (
                      <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                        {formality}
                      </span>
                    )}
                    {tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-background/80 border border-border px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-end sm:items-center justify-between sm:flex-col sm:justify-between gap-2 w-full sm:w-auto shrink-0">
                <div className="text-[0.8125rem] text-muted-foreground">
                  Created{" "}
                  <span className="text-foreground">
                    {formatRelativeTime(profile.created_at)}
                  </span>
                </div>
                <span className="inline-flex items-center justify-center rounded-lg border border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto">
                  View details
                </span>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

