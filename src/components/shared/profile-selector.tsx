"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProfileWithMembers } from "@/app/actions/profile";
import { tonePreferencesToPresetId } from "@/lib/tone-preset-utils";
import { getTonePresetById } from "@/lib/tone-presets";

interface ProfileSelectorProps {
  profiles: ProfileWithMembers[];
  selectedProfile: string | null;
  onProfileChange: (profileId: string | null) => void;
  isLoadingProfiles: boolean;
}

export function ProfileSelector({
  profiles,
  selectedProfile,
  onProfileChange,
  isLoadingProfiles,
}: ProfileSelectorProps) {
  const selectedProfileObj = profiles.find((p) => p.id === selectedProfile);

  return (
    <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Recipient profile
        </label>
        <Button
          variant="outline"
          asChild
          className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
        >
          <Link href="/dashboard/profiles">Manage profiles</Link>
        </Button>
      </div>
      <select
        className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
        value={selectedProfile || ""}
        onChange={(e) => onProfileChange(e.target.value || null)}
        disabled={isLoadingProfiles}
      >
        <option value="">Select a profile (optional)</option>
        {profiles.map((profile) => {
          // Build display name similar to profile-list.tsx
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
              displayName = `${profile.name} · ${memberNames} +${
                profile.members.length - 2
              }`;
            } else {
              displayName = `${profile.name} · ${memberNames}`;
            }
          }
          const relationshipType = profile.relationship_type || "Other";
          return (
            <option key={profile.id} value={profile.id}>
              {displayName} ({relationshipType})
            </option>
          );
        })}
      </select>
      {selectedProfileObj && selectedProfileObj.tone_preferences && (
        <div className="flex flex-wrap gap-1.5 text-[0.8125rem] text-foreground">
          {/* Display tone preset */}
          {(() => {
            const presetId = tonePreferencesToPresetId(selectedProfileObj.tone_preferences);
            const preset = getTonePresetById(presetId);
            return preset ? (
              <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 font-medium">
                {preset.name}
              </span>
            ) : null;
          })()}
          {/* Display tags */}
          {selectedProfileObj.tone_preferences.tags &&
            selectedProfileObj.tone_preferences.tags.length > 0 &&
            selectedProfileObj.tone_preferences.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-background/80 border border-border px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
        </div>
      )}
    </Card>
  );
}

