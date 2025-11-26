"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SimpleProfileForm, type SimpleProfileFormHandle } from "./simple-profile-form";
import { ProfileWithMembers } from "@/app/actions/profile";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditProfileButtonProps {
  profile: ProfileWithMembers;
  variant?: "default" | "icon-only";
  size?: "default" | "sm";
  onSuccess?: () => void;
  className?: string;
}

export function EditProfileButton({
  profile,
  variant = "default",
  size = "default",
  onSuccess,
  className,
}: EditProfileButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<SimpleProfileFormHandle>(null);

  const handleSuccess = () => {
    setIsSubmitting(false);
    formRef.current?.resetSubmitting();
    setOpen(false);
    // Refresh the page to show the updated profile
    router.refresh();
    onSuccess?.();
  };

  const handleCancel = () => {
    setIsSubmitting(false);
    formRef.current?.resetSubmitting();
    setOpen(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    formRef.current?.submit();
    // Reset submitting state after a short delay in case of validation errors
    setTimeout(() => {
      if (isSubmitting) {
        formRef.current?.resetSubmitting();
        setIsSubmitting(false);
      }
    }, 100);
  };

  const buttonClasses = cn(
    "inline-flex items-center justify-center rounded-lg border border-border bg-card text-sm text-foreground hover:bg-muted h-auto",
    variant === "icon-only" ? "px-2.5 py-1.5" : "gap-1.5 px-3 py-1.5",
    size === "sm" && "px-2.5 py-1.5",
    className
  );

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={buttonClasses}
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil className="h-3.5 w-3.5" />
          {variant === "default" && "Edit profile"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="fixed inset-y-0 right-0 left-auto h-full w-full sm:w-[600px] mt-0 rounded-none sm:rounded-l-lg border-l border-t-0 border-b-0 flex flex-col">
        <div className="hidden">
          {/* Hide the default drag handle */}
        </div>
        <DrawerHeader className="border-b shrink-0">
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>
            Update profile information to personalize replies for this recipient.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto flex-1 min-h-0 p-6">
          <SimpleProfileForm
            ref={formRef}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onSubmittingChange={setIsSubmitting}
            initialData={profile}
            mode="edit"
          />
        </div>
        <DrawerFooter className="border-t shrink-0 gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

