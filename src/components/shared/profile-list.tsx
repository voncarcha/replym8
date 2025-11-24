"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProfileWithMembers, deleteProfile } from "@/app/actions/profile";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { useProfileStore } from "@/lib/store";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileListProps {
  profiles: ProfileWithMembers[];
  allProfilesCount: number;
  onProfileDeleted?: () => void;
}

export function ProfileList({ profiles, allProfilesCount, onProfileDeleted }: ProfileListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const decrementProfileCount = useProfileStore((state) => state.decrementProfileCount);

  const handleDelete = async (profileId: string, profileName: string) => {
    setDeletingId(profileId);
    try {
      const result = await deleteProfile(profileId);
      if (result.success) {
        toast.success("Profile deleted", {
          description: `${profileName} has been deleted.`,
        });
        decrementProfileCount();
        router.refresh();
        onProfileDeleted?.();
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile", {
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setDeletingId(null);
    }
  };
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
            displayName = `${profile.name} · ${memberNames} +${
              profile.members.length - 2
            }`;
          } else {
            displayName = `${profile.name} · ${memberNames}`;
          }
        }

        return (
          <Card
            key={profile.id}
            className="rounded-xl border-border bg-card/80 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/50 transition-colors"
          >
            <Link href={`/dashboard/profiles/${profile.id}`} className="flex items-start gap-3 flex-1 min-w-0">
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
            </Link>
            <div className="flex items-end justify-between sm:flex-col sm:justify-between gap-2 w-full sm:w-auto shrink-0">
              <div className="text-[0.8125rem] text-muted-foreground">
                Created{" "}
                <span className="text-foreground">
                  {formatRelativeTime(profile.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/profiles/${profile.id}`}>
                  <span className="inline-flex items-center justify-center rounded-lg border border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto">
                    View details
                  </span>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-card text-sm text-destructive px-2.5 py-1.5 hover:bg-destructive/10 hover:border-destructive/50 h-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{profile.name}&quot;? This action cannot be undone and will remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(profile.id, profile.name);
                        }}
                        disabled={deletingId === profile.id}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deletingId === profile.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
