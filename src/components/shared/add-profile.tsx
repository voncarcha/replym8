"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const tonePreferencesSchema = z.object({
  formality: z.array(z.string()).optional(),
  emotion: z.array(z.string()).optional(),
  style: z.array(z.string()).optional(),
  personality: z.array(z.string()).optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  type: z.enum(["individual", "group"] as const),
  tone_preferences: tonePreferencesSchema,
});

type FormValues = z.infer<typeof formSchema>;

const TONE_OPTIONS = {
  formality: [
    { value: "formal", label: "Formal" },
    { value: "informal", label: "Informal" },
    { value: "semi-formal", label: "Semi-formal" },
    { value: "casual", label: "Casual" },
    { value: "academic", label: "Academic" },
  ],
  emotion: [
    { value: "friendly", label: "Friendly" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "empathetic", label: "Empathetic" },
    { value: "confident", label: "Confident" },
    { value: "worried", label: "Worried" },
    { value: "humorous", label: "Humorous" },
    { value: "sarcastic", label: "Sarcastic" },
    { value: "warm", label: "Warm" },
  ],
  style: [
    { value: "professional", label: "Professional" },
    { value: "direct", label: "Direct" },
    { value: "concise", label: "Concise" },
    { value: "technical", label: "Technical" },
    { value: "persuasive", label: "Persuasive" },
    { value: "descriptive", label: "Descriptive" },
    { value: "narrative", label: "Narrative" },
    { value: "journalistic", label: "Journalistic" },
  ],
  personality: [
    { value: "approachable", label: "Approachable" },
    { value: "respectful", label: "Respectful" },
    { value: "authoritative", label: "Authoritative" },
    { value: "witty", label: "Witty" },
    { value: "fun", label: "Fun" },
    { value: "bro-y", label: "Bro-y" },
    { value: "robotic", label: "Robotic" },
  ],
};

interface AddProfileProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function AddProfile({ onSuccess, trigger }: AddProfileProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "individual",
      tone_preferences: {
        formality: [],
        emotion: [],
        style: [],
        personality: [],
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // TODO: Implement API call to create profile
      console.log("Profile data:", data);
      
      // Reset form and close drawer
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="overflow-y-auto flex-1 min-h-0 p-6 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter profile name" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this profile (e.g., &quot;Lena · Product Lead&quot; or &quot;ACME · Exec team&quot;).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description (optional)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Additional context about this profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select profile type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose whether this profile is for an individual or a group.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label>Tone Preferences</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Select the tone characteristics you want to use for replies from this profile.
              </p>

              {/* Formality */}
              <FormField
                control={form.control}
                name="tone_preferences.formality"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <Label className="text-sm font-semibold">Formality</Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Ranges from a high degree of professionalism to a relaxed, conversational style.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TONE_OPTIONS.formality.map((option) => (
                        <label
                          key={option.value}
                          htmlFor={`formality-${option.value}`}
                          className="flex flex-row items-center space-x-2 cursor-pointer"
                        >
                          <FormControl>
                            <Checkbox
                              id={`formality-${option.value}`}
                              checked={field.value?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), option.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <span className="text-sm font-normal leading-none">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Emotion/Voice */}
              <FormField
                control={form.control}
                name="tone_preferences.emotion"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <Label className="text-sm font-semibold">Emotion/Voice</Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Conveys specific emotional context to build connection or elicit a certain sentiment.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TONE_OPTIONS.emotion.map((option) => (
                        <label
                          key={option.value}
                          htmlFor={`emotion-${option.value}`}
                          className="flex flex-row items-center space-x-2 cursor-pointer"
                        >
                          <FormControl>
                            <Checkbox
                              id={`emotion-${option.value}`}
                              checked={field.value?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), option.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <span className="text-sm font-normal leading-none">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Style/Clarity */}
              <FormField
                control={form.control}
                name="tone_preferences.style"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <Label className="text-sm font-semibold">Style/Clarity</Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Focuses on the structure and objective of the communication.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TONE_OPTIONS.style.map((option) => (
                        <label
                          key={option.value}
                          htmlFor={`style-${option.value}`}
                          className="flex flex-row items-center space-x-2 cursor-pointer"
                        >
                          <FormControl>
                            <Checkbox
                              id={`style-${option.value}`}
                              checked={field.value?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), option.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <span className="text-sm font-normal leading-none">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Personality */}
              <FormField
                control={form.control}
                name="tone_preferences.personality"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <Label className="text-sm font-semibold">Personality</Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Infuses specific brand personality traits, including the use of slang, emojis, or a specific persona.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TONE_OPTIONS.personality.map((option) => (
                        <label
                          key={option.value}
                          htmlFor={`personality-${option.value}`}
                          className="flex flex-row items-center space-x-2 cursor-pointer"
                        >
                          <FormControl>
                            <Checkbox
                              id={`personality-${option.value}`}
                              checked={field.value?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), option.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <span className="text-sm font-normal leading-none">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            </div>

            <DrawerFooter className="border-t shrink-0">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Profile
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

