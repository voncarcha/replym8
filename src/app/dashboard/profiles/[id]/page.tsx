import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfileById } from "@/app/actions/profile";
import { notFound } from "next/navigation";
import { DeleteProfileButton } from "@/components/shared/delete-profile-button";
import { ProfileEdit } from "@/components/shared/profile-edit";
import { ProfileDetails } from "@/components/shared/profile-details";

export default async function ProfileDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileById(id);

  if (!profile) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/profiles">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h3 className="text-base sm:text-xl font-medium tracking-tight text-foreground">
              Profile details
            </h3>
            <p className="text-sm sm:text-sm text-muted-foreground">
              Edit how ReplyM8 understands this recipient.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <ProfileEdit 
            profile={profile}
            trigger={
              <Button
                variant="outline"
                className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-3 py-1.5 hover:bg-muted h-auto"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            }
          />
          <DeleteProfileButton 
            profileId={profile.id} 
            profileName={profile.name}
            redirectAfterDelete={true}
          />
        </div>
      </div>

      {/* Content */}
      <ProfileDetails profile={profile} />
    </>
  );
}

