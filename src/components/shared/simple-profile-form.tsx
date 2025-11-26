"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { toast } from "sonner";
import {
  simpleProfileSchema,
  SimpleProfileFormData,
  INDIVIDUAL_RELATIONSHIP_TYPES,
  GROUP_RELATIONSHIP_TYPES,
} from "./simple-profile-schema";
import { GroupMember } from "./group-member";
import { CreateProfileInput } from "@/types";
import { createProfile, updateProfile, ProfileWithMembers } from "@/app/actions/profile";
import { TONE_PRESETS, getTonePresetById } from "@/lib/tone-presets";
import { tonePreferencesToPresetId, presetIdToTonePreferences } from "@/lib/tone-preset-utils";


export interface SimpleProfileFormHandle {
  submit: () => void;
  resetSubmitting: () => void;
}

interface SimpleProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmittingChange?: (isSubmitting: boolean) => void;
  initialData?: ProfileWithMembers;
  mode?: "create" | "edit";
}

export const SimpleProfileForm = forwardRef<SimpleProfileFormHandle, SimpleProfileFormProps>(
  ({ onSuccess, onSubmittingChange, initialData, mode = "create" }, ref) => {
    const [customTagInput, setCustomTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Notify parent when submitting state changes
    useEffect(() => {
      onSubmittingChange?.(isSubmitting);
    }, [isSubmitting, onSubmittingChange]);

    // Prepare default values based on initialData or defaults
    const getDefaultValues = (): SimpleProfileFormData => {
      if (initialData) {
        // Convert tone_preferences to preset ID
        const presetId = tonePreferencesToPresetId(initialData.tone_preferences);
        const preset = getTonePresetById(presetId);
        
        // Extract custom tags (tags that are not in the preset's default tags)
        const presetTags = preset?.tags || [];
        const allTags = initialData.tone_preferences.tags || [];
        const customTags = allTags.filter((tag) => !presetTags.includes(tag));

        return {
          profileType: initialData.type === "individual" ? "Individual" : "Group",
          name: initialData.name,
          relationshipType: initialData.relationship_type,
          tonePreset: presetId,
          tags: customTags, // Only store custom tags in the form
          notes: initialData.notes || "",
          groupMembers: initialData.members?.map((m: { name: string; role?: string | null; email?: string | null }) => ({
            name: m.name,
            role: m.role || "",
            email: m.email || "",
          })) || [],
        };
      }
      return {
        profileType: "Individual",
        name: "",
        relationshipType: INDIVIDUAL_RELATIONSHIP_TYPES[0],
        tonePreset: "professional",
        tags: [],
        notes: "",
        groupMembers: [],
      };
    };

    const form = useForm<SimpleProfileFormData>({
      resolver: zodResolver(simpleProfileSchema),
      defaultValues: getDefaultValues(),
    });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "groupMembers",
  });

  const profileType = form.watch("profileType");
  const tags = form.watch("tags") || [];
  const tonePreset = form.watch("tonePreset");
  
  // Get the selected preset to show its tags
  const selectedPreset = getTonePresetById(tonePreset);

  // Reset relationship type when profile type changes
  useEffect(() => {
    const currentRelationshipType = form.getValues("relationshipType");
    const options =
      profileType === "Individual"
        ? INDIVIDUAL_RELATIONSHIP_TYPES
        : GROUP_RELATIONSHIP_TYPES;

    // If current relationship type is not valid for the new profile type, reset it
    const isValid = options.some((opt) => opt === currentRelationshipType);
    if (!isValid) {
      form.setValue("relationshipType", options[0]);
    }
  }, [profileType, form]);

  const relationshipOptions =
    profileType === "Individual"
      ? INDIVIDUAL_RELATIONSHIP_TYPES
      : GROUP_RELATIONSHIP_TYPES;

  const onSubmit = async (data: SimpleProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Convert preset ID to tone_preferences format
      const tonePreferences = presetIdToTonePreferences(data.tonePreset, data.tags);
      
      // Transform form data to match database schema
      const profileData: CreateProfileInput = {
        name: data.name,
        type: data.profileType.toLowerCase() as "individual" | "group",
        relationship_type: data.relationshipType,
        tone_preferences: tonePreferences,
        notes: data.notes || null,
      };

      // Note: groupMembers will be saved separately to profile_members table
      const groupMembers = data.groupMembers || [];

      // Call the appropriate server action based on mode
      let result;
      if (mode === "edit" && initialData) {
        result = await updateProfile(initialData.id, profileData, groupMembers);
        if (result.success) {
          toast.success("Profile updated successfully!", {
            description: `"${profileData.name}" has been updated.`,
          });
        }
      } else {
        result = await createProfile(profileData, groupMembers);
        if (result.success) {
          toast.success("Profile created successfully!", {
            description: `"${profileData.name}" has been added to your profiles.`,
          });
          form.reset();
        }
      }
      
      if (result.success) {
        onSuccess?.();
      } else {
        throw new Error(result.message || `Failed to ${mode === "edit" ? "update" : "create"} profile`);
      }
    } catch (error) {
      console.error(`Error ${mode === "edit" ? "updating" : "creating"} profile:`, error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(`Failed to ${mode === "edit" ? "update" : "create"} profile`, {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: unknown) => {
    console.error("Form validation errors:", errors);
    setIsSubmitting(false);
    toast.error("Form validation failed", {
      description: "Please check the form fields and try again.",
    });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = tags;
    if (currentTags.includes(tag)) {
      form.setValue(
        "tags",
        currentTags.filter((t) => t !== tag)
      );
    } else {
      form.setValue("tags", [...currentTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmedTag = customTagInput.trim();
    if (!trimmedTag) return;
    
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(trimmedTag)) {
      form.setValue("tags", [...currentTags, trimmedTag], { shouldValidate: true });
      setCustomTagInput("");
    }
  };

    // Expose submit method to parent via ref
    useImperativeHandle(ref, () => ({
      submit: () => {
        setIsSubmitting(true);
        form.handleSubmit(onSubmit, onError)();
      },
      resetSubmitting: () => {
        setIsSubmitting(false);
      },
    }));

    return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
        id="simple-profile-form"
      >
        {/* Identity Section */}
        <div className="space-y-4 pb-6 border-b">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold tracking-tight">Identity</h3>
            <p className="text-sm text-muted-foreground">
              Provide basic information about the profile.
            </p>
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="profileType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Individual" id="individual" />
                        <Label htmlFor="individual" className="cursor-pointer">
                          Individual
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Group" id="group" />
                        <Label htmlFor="group" className="cursor-pointer">
                          Group
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationshipType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {relationshipOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Tone Preset Section */}
        <div className="space-y-4 pb-6 border-b">
          <div className="space-y-3.5">
            <h3 className="text-base font-semibold tracking-tight">Tone Preferences</h3>
            <p className="text-sm text-muted-foreground">
              Select a tone preset for communication style.
            </p>
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="tonePreset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone Preset</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-auto min-h-12 py-2 [&>span]:truncate [&>span]:text-left">
                        <SelectValue placeholder="Select a tone preset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TONE_PRESETS.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{preset.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {preset.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPreset && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        Preset tags:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPreset.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Tags Section */}
            <div className="space-y-2 pt-4 border-t">
              <Label>Custom Tags</Label>
              <p className="text-sm text-muted-foreground">
                Add custom tags to further customize the tone.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom tag"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCustomTag}
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-4 pb-6 border-b">
          <div className="space-y-3.5">
            <h3 className="text-base font-semibold tracking-tight">Notes</h3>
            <p className="text-sm text-muted-foreground">
              Add any additional notes or context about this profile.
            </p>
          </div>
          <div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes or context..."
                      className="min-h-[100px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Group Members Section */}
        {profileType === "Group" && (
          <div className="space-y-4 pb-6 border-b">
            <div className="space-y-3.5">
              <h3 className="text-base font-semibold tracking-tight">Group Members</h3>
              <p className="text-sm text-muted-foreground">
                Add members to this group profile.
              </p>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <GroupMember
                  key={field.id}
                  control={form.control}
                  index={index}
                  onRemove={() => remove(index)}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", role: undefined, email: undefined })}
              >
                Add Member
              </Button>
            </div>
          </div>
        )}

      </form>
    </Form>
    );
  }
);

SimpleProfileForm.displayName = "SimpleProfileForm";

