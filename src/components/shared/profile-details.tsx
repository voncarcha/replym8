import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProfileWithMembers } from "@/app/actions/profile";
import { getInitials, formatRelativeTime } from "@/lib/utils";

interface ProfileDetailsProps {
  profile: ProfileWithMembers;
}

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  const initials = getInitials(profile.name);
  const tonePrefs = profile.tone_preferences;

  return (
    <div className="px-4 sm:px-5 pb-4 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] overflow-y-auto pt-4">
      {/* Left: fields */}
      <div className="space-y-3">
        <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <Label htmlFor="profile-name" className="text-sm text-muted-foreground">Name</Label>
              <Input
                id="profile-name"
                className="mt-1"
                defaultValue={profile.name}
                readOnly
              />
            </div>
          </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="relationship-type" className="text-sm text-muted-foreground">Relationship Type</Label>
                <Input
                  id="relationship-type"
                  className="mt-1"
                  defaultValue={profile.relationship_type}
                  readOnly
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Profile Type</Label>
                <Input
                  className="mt-1 capitalize"
                  defaultValue={profile.type}
                  readOnly
                />
              </div>
            </div>

          {/* Tone Preferences */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Tone Preferences</Label>
            <div className="flex flex-wrap gap-2">
              {tonePrefs.formality && (
                <Badge variant="outline" className="text-xs">
                  Formality: {tonePrefs.formality}
                </Badge>
              )}
              {tonePrefs.friendliness && (
                <Badge variant="outline" className="text-xs">
                  Friendliness: {tonePrefs.friendliness}
                </Badge>
              )}
              {tonePrefs.preferredLength && (
                <Badge variant="outline" className="text-xs">
                  Length: {tonePrefs.preferredLength}
                </Badge>
              )}
              {tonePrefs.emojiUsage && (
                <Badge variant="outline" className="text-xs">
                  Emoji: {tonePrefs.emojiUsage}
                </Badge>
              )}
            </div>
          </div>

          {/* Tags */}
          {tonePrefs.tags && tonePrefs.tags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {tonePrefs.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes" className="text-sm text-muted-foreground">Notes</Label>
            <Textarea
              id="notes"
              className="mt-1 min-h-20 resize-y"
              placeholder="Anything you want ReplyM8 to remember."
              defaultValue={profile.notes || ""}
              readOnly
            />
          </div>

          {/* Group Members Section */}
          {profile.type === "group" && profile.members && profile.members.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Group Members</Label>
              <div className="space-y-2">
                {profile.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-lg border border-border bg-background/50">
                    <div>
                      <div className="text-sm font-medium text-foreground">{member.name}</div>
                      {member.role && (
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      )}
                      {member.email && (
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Created {formatRelativeTime(profile.created_at)}
            </div>
          </div>
        </Card>
      </div>

      {/* Right: Additional Info */}
      <div className="space-y-3">
        <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium tracking-tight text-foreground">
              Profile Information
            </h4>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Profile ID:</span>
              <span className="ml-2 text-foreground font-mono text-xs">{profile.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2 text-foreground">
                {new Date(profile.created_at).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {profile.updated_at && (
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2 text-foreground">
                  {new Date(profile.updated_at).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
            {profile.type === "group" && profile.members && (
              <div>
                <span className="text-muted-foreground">Members:</span>
                <span className="ml-2 text-foreground">{profile.members.length}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

