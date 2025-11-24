"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Trash2 } from "lucide-react";
import { deleteProfile } from "@/app/actions/profile";
import { useProfileStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeleteProfileButtonProps {
  profileId: string;
  profileName: string;
  variant?: "default" | "icon-only";
  size?: "default" | "sm";
  redirectAfterDelete?: boolean;
  redirectPath?: string;
  onDeleted?: () => void;
  className?: string;
}

export function DeleteProfileButton({
  profileId,
  profileName,
  variant = "default",
  size = "default",
  redirectAfterDelete = false,
  redirectPath = "/dashboard/profiles",
  onDeleted,
  className,
}: DeleteProfileButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const decrementProfileCount = useProfileStore((state) => state.decrementProfileCount);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProfile(profileId);
      if (result.success) {
        toast.success("Profile deleted", {
          description: `${profileName} has been deleted.`,
        });
        decrementProfileCount();
        
        if (redirectAfterDelete) {
          // Redirect immediately without waiting for refresh
          router.push(redirectPath);
          // Small delay to ensure redirect happens before any revalidation
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          router.refresh();
        }
        
        onDeleted?.();
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile", {
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const buttonClasses = cn(
    "inline-flex items-center justify-center rounded-lg border border-destructive/50 bg-card text-sm text-destructive dark:text-red-400 hover:bg-destructive/10 hover:border-destructive h-auto",
    variant === "icon-only" ? "px-2.5 py-1.5" : "gap-1.5 px-3 py-1.5",
    size === "sm" && "px-2.5 py-1.5",
    className
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={buttonClasses}
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {variant === "default" && "Delete profile"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Profile</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{profileName}&quot;? This action cannot be undone and will remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

