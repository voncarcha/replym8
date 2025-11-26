"use client";

import { GeneratedReplyWithProfile } from "@/types";
import { ConversationItem } from "./conversation-item";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";

interface ConversationListProps {
  replies: GeneratedReplyWithProfile[];
  filterProfileId: string | null;
  onItemClick?: (reply: GeneratedReplyWithProfile) => void;
}

export function ConversationList({
  replies,
  filterProfileId,
  onItemClick,
}: ConversationListProps) {
  const filteredReplies = useMemo(() => {
    if (!filterProfileId) {
      return replies;
    }
    return replies.filter((reply) => reply.profile_id === filterProfileId);
  }, [replies, filterProfileId]);

  if (filteredReplies.length === 0) {
    return (
      <Card className="rounded-xl border-border bg-card/60 p-6 sm:p-8 space-y-3 text-center">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-lg bg-muted border border-border flex items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-foreground">
            {filterProfileId ? "No conversations found" : "No conversations yet"}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {filterProfileId
              ? "No generated replies found for the selected profile."
              : "Your generated replies will appear here once you start creating them."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {filteredReplies.map((reply) => (
        <ConversationItem
          key={reply.id}
          reply={reply}
          onClick={() => onItemClick?.(reply)}
        />
      ))}
    </div>
  );
}

