"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { createProfile } from "@/app/actions/profile";

const SUGGESTED_TAGS = [
  "Short replies",
  "No emojis",
  "Bullet points",
  "Detailed",
  "TL;DR preferred",
  "Data-first",
  "Weekly status",
  "Strictly professional",
  "Friendly",
];

export interface SimpleProfileFormHandle {
  submit: () => void;
  resetSubmitting: () => void;
}

interface SimpleProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmittingChange?: (isSubmitting: boolean) => void;
}

export const SimpleProfileForm = forwardRef<SimpleProfileFormHandle, SimpleProfileFormProps>(
  ({ onSuccess, onSubmittingChange }, ref) => {
    const [customTagInput, setCustomTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Notify parent when submitting state changes
    useEffect(() => {
      onSubmittingChange?.(isSubmitting);
    }, [isSubmitting, onSubmittingChange]);

    const form = useForm<SimpleProfileFormData>({
    resolver: zodResolver(simpleProfileSchema),
    defaultValues: {
      profileType: "Individual",
      name: "",
      relationshipType: INDIVIDUAL_RELATIONSHIP_TYPES[0],
      formality: "Neutral",
      friendliness: "Neutral",
      preferredLength: "Medium",
      emojiUsage: "Minimal",
      tags: [],
      groupMembers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "groupMembers",
  });

  const profileType = form.watch("profileType");
  const tags = form.watch("tags") || [];

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
      // Transform form data to match database schema
      const profileData: CreateProfileInput = {
        name: data.name,
        type: data.profileType.toLowerCase() as "individual" | "group",
        relationship_type: data.relationshipType,
        tone_preferences: {
          formality: data.formality,
          friendliness: data.friendliness,
          preferredLength: data.preferredLength,
          emojiUsage: data.emojiUsage,
          tags: data.tags,
        },
      };

      // Note: groupMembers will be saved separately to profile_members table
      const groupMembers = data.groupMembers || [];

      // Call the server action to create the profile
      const result = await createProfile(profileData, groupMembers);
      
      if (result.success) {
        toast.success("Profile created successfully!", {
          description: `"${profileData.name}" has been added to your profiles.`,
        });
        form.reset();
        onSuccess?.();
      } else {
        throw new Error(result.message || "Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error("Failed to create profile", {
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
    if (trimmedTag && !tags.includes(trimmedTag)) {
      form.setValue("tags", [...tags, trimmedTag]);
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
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>
              Provide basic information about the profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Basic Tone Section */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Tone</CardTitle>
            <CardDescription>
              Set the tone preferences for communication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="formality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formality</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Formal" id="formal" />
                        <Label htmlFor="formal" className="cursor-pointer">
                          Formal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Neutral" id="neutral-formality" />
                        <Label htmlFor="neutral-formality" className="cursor-pointer">
                          Neutral
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Casual" id="casual" />
                        <Label htmlFor="casual" className="cursor-pointer">
                          Casual
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
              name="friendliness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Friendliness</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Friendly" id="friendly" />
                        <Label htmlFor="friendly" className="cursor-pointer">
                          Friendly
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Neutral" id="neutral-friendliness" />
                        <Label htmlFor="neutral-friendliness" className="cursor-pointer">
                          Neutral
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Reserved" id="reserved" />
                        <Label htmlFor="reserved" className="cursor-pointer">
                          Reserved
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
              name="preferredLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Length</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Short" id="short" />
                        <Label htmlFor="short" className="cursor-pointer">
                          Short
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Medium" id="medium" />
                        <Label htmlFor="medium" className="cursor-pointer">
                          Medium
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Long" id="long" />
                        <Label htmlFor="long" className="cursor-pointer">
                          Long
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
              name="emojiUsage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emoji Usage</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="None" id="none" />
                        <Label htmlFor="none" className="cursor-pointer">
                          None
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Minimal" id="minimal" />
                        <Label htmlFor="minimal" className="cursor-pointer">
                          Minimal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Allowed" id="allowed" />
                        <Label htmlFor="allowed" className="cursor-pointer">
                          Allowed
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Tags Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Select or add tags to describe preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
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
              <div className="flex flex-wrap gap-2">
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
          </CardContent>
        </Card>

        {/* Group Members Section */}
        {profileType === "Group" && (
          <Card>
            <CardHeader>
              <CardTitle>Group Members</CardTitle>
              <CardDescription>
                Add members to this group profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        )}

      </form>
    </Form>
    );
  }
);

SimpleProfileForm.displayName = "SimpleProfileForm";

