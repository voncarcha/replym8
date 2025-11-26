"use client";

import { useState } from "react";
import { GeneratedReplyWithProfile } from "@/types";
import { Profile } from "@/types";
import { ConversationList } from "./conversation-list";
import { ConversationFilter } from "./conversation-filter";
import { ConversationDetailsDrawer } from "./conversation-details-drawer";

interface ConversationsContentProps {
  replies: GeneratedReplyWithProfile[];
  profiles: Profile[];
}

export function ConversationsContent({ replies, profiles }: ConversationsContentProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedReply, setSelectedReply] = useState<GeneratedReplyWithProfile | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleItemClick = (reply: GeneratedReplyWithProfile) => {
    setSelectedReply(reply);
    setDrawerOpen(true);
  };

  return (
    <>
      {/* Filter */}
      <div className="px-4 sm:px-5 pb-3">
        <ConversationFilter
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          onProfileChange={setSelectedProfileId}
        />
      </div>

      {/* Conversation list */}
      <div className="px-4 sm:px-5 pb-4 space-y-3 overflow-y-auto">
        <ConversationList
          replies={replies}
          filterProfileId={selectedProfileId}
          onItemClick={handleItemClick}
        />
      </div>

      {/* Conversation Details Drawer */}
      <ConversationDetailsDrawer
        reply={selectedReply}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}

