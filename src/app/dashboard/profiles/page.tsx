import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddProfile } from "@/components/shared/add-profile";
import { ProfileFilters } from "@/components/shared/profile-filters";
import { getProfiles } from "@/app/actions/profile";

export default async function ProfilesPage() {
  const profiles = await getProfiles();

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
        <ProfileFilters profiles={profiles} />
      </div>
    </>
  );
}

