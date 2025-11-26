"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeneratedReplyWithProfile } from "@/types";
import { formatTimeAgo, formatDate } from "@/lib/date-utils";
import { X, MessageSquare, User, Calendar, FileText } from "lucide-react";

interface ConversationDetailsDrawerProps {
  reply: GeneratedReplyWithProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConversationDetailsDrawer({
  reply,
  open,
  onOpenChange,
}: ConversationDetailsDrawerProps) {
  if (!reply) return null;

  const promptPayload = reply.prompt_payload as {
    message?: string;
    additionalContext?: string;
    length?: string;
    systemPrompt?: string;
    userPrompt?: string;
    profileId?: string;
  };

  const createdDate = new Date(reply.created_at);
  const timeAgo = formatTimeAgo(createdDate);
  const formattedDate = formatDate(createdDate);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="fixed inset-y-0 right-0 left-auto h-full w-full sm:w-[60vw] max-w-[60vw] mt-0 rounded-none sm:rounded-l-lg border-l border-t-0 border-b-0 flex flex-col [&>div:first-child]:hidden">
        <DrawerHeader className="border-b shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DrawerTitle className="text-lg font-semibold tracking-tight">
                Conversation Details
              </DrawerTitle>
              <DrawerDescription className="mt-1">
                Generated {timeAgo} • {formattedDate}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto flex-1 min-h-0 px-4 py-4 space-y-4">
          {/* Profile Information */}
          {reply.profile && (
            <Card className="rounded-lg border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Profile</h3>
              </div>
              <p className="text-sm text-foreground">{reply.profile.name}</p>
            </Card>
          )}

          {/* Original Message */}
          {promptPayload?.message && (
            <Card className="rounded-lg border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Original Message</h3>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {promptPayload.message}
              </p>
            </Card>
          )}

          {/* Additional Context */}
          {promptPayload?.additionalContext && (
            <Card className="rounded-lg border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Additional Context</h3>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {promptPayload.additionalContext}
              </p>
            </Card>
          )}

          {/* Generated Reply */}
          <Card className="rounded-lg border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Generated Reply</h3>
              </div>
              {promptPayload?.length && (
                <Badge variant="secondary" className="text-xs">
                  {promptPayload.length}
                </Badge>
              )}
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {reply.model_response}
            </p>
          </Card>

          {/* Metadata */}
          <Card className="rounded-lg border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">Metadata</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time ago:</span>
                <span className="text-foreground">{timeAgo}</span>
              </div>
              {promptPayload?.length && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Length preference:</span>
                  <span className="text-foreground">{promptPayload.length}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        <DrawerFooter className="border-t shrink-0">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

