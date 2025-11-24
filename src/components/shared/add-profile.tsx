"use client";

import { useState, useRef } from "react";
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

interface AddProfileProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function AddProfile({ onSuccess, trigger }: AddProfileProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<SimpleProfileFormHandle>(null);

  const handleSuccess = () => {
    setIsSubmitting(false);
    formRef.current?.resetSubmitting();
      setOpen(false);
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
    // The form's onError will also reset it, but this is a backup
    setTimeout(() => {
      if (isSubmitting) {
        formRef.current?.resetSubmitting();
        setIsSubmitting(false);
      }
    }, 100);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        {trigger || (
          <Button className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 text-white dark:text-slate-950 text-sm font-medium tracking-tight px-3 py-1.5 hover:bg-sky-400 h-auto">
            Add Profile
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="fixed inset-y-0 right-0 left-auto h-full w-full sm:w-[600px] mt-0 rounded-none sm:rounded-l-lg border-l border-t-0 border-b-0 flex flex-col">
        <div className="hidden">
          {/* Hide the default drag handle */}
        </div>
        <DrawerHeader className="border-b shrink-0">
          <DrawerTitle>Add New Profile</DrawerTitle>
          <DrawerDescription>
            Create a new profile to personalize replies for a person, team, or account.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto flex-1 min-h-0 p-6">
          <SimpleProfileForm
            ref={formRef}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            onSubmittingChange={setIsSubmitting}
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
              {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

