"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Profile } from "@/types";

interface ConversationFilterProps {
  profiles: Profile[];
  selectedProfileId: string | null;
  onProfileChange: (profileId: string | null) => void;
}

export function ConversationFilter({
  profiles,
  selectedProfileId,
  onProfileChange,
}: ConversationFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground whitespace-nowrap">
        Filter by profile:
      </label>
      <Select
        value={selectedProfileId || "all"}
        onValueChange={(value) => onProfileChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[200px] h-8 text-sm">
          <SelectValue placeholder="All profiles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All profiles</SelectItem>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              {profile.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

