"use client";

import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { SimpleProfileFormData } from "./simple-profile-schema";

interface GroupMemberProps {
  control: Control<SimpleProfileFormData>;
  index: number;
  onRemove: () => void;
}

export function GroupMember({ control, index, onRemove }: GroupMemberProps) {

  return (
    <div className="flex gap-2 items-start p-4 border rounded-lg">
      <div className="flex-1 grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name={`groupMembers.${index}.name`}
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
          control={control}
          name={`groupMembers.${index}.role`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="Enter role" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`groupMembers.${index}.email`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="mt-8"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

