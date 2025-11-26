"use client";

import { useState, useMemo } from "react";
import { ProfileWithMembers } from "@/app/actions/profile";
import { ProfileList } from "./profile-list";

interface ProfileFiltersProps {
  profiles: ProfileWithMembers[];
}

export function ProfileFilters({ profiles }: ProfileFiltersProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Get all unique relationship types from profiles
  const availableRelationshipTypes = useMemo(() => {
    const types = new Set<string>();
    profiles.forEach((profile) => {
      if (profile.relationship_type) {
        types.add(profile.relationship_type);
      }
    });
    return Array.from(types).sort();
  }, [profiles]);

  // Filter profiles based on selected relationship type
  const filteredProfiles = useMemo(() => {
    if (!selectedFilter) {
      return profiles;
    }
    return profiles.filter(
      (profile) => profile.relationship_type === selectedFilter
    );
  }, [profiles, selectedFilter]);

  // Calculate counts for each relationship type
  const relationshipTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    profiles.forEach((profile) => {
      if (profile.relationship_type) {
        counts[profile.relationship_type] =
          (counts[profile.relationship_type] || 0) + 1;
      }
    });
    return counts;
  }, [profiles]);

  const allCount = profiles.length;

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 text-sm pt-4">
        <button
          onClick={() => setSelectedFilter(null)}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors cursor-pointer ${
            selectedFilter === null
              ? "bg-muted text-foreground"
              : "border border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          All
          <span className="text-[0.75rem] text-muted-foreground">{allCount}</span>
        </button>
        {availableRelationshipTypes.map((relationshipType) => {
          const count = relationshipTypeCounts[relationshipType] || 0;
          const isSelected = selectedFilter === relationshipType;
          return (
            <button
              key={relationshipType}
              onClick={() => setSelectedFilter(relationshipType)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors cursor-pointer ${
                isSelected
                  ? "bg-muted text-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {relationshipType}
              <span className="text-[0.75rem] text-muted-foreground">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Render filtered profiles */}
      <ProfileList profiles={filteredProfiles} allProfilesCount={allCount} />
    </>
  );
}

