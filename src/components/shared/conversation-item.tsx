import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { GeneratedReplyWithProfile } from "@/types";
import { formatTimeAgo } from "@/lib/date-utils";

interface ConversationItemProps {
  reply: GeneratedReplyWithProfile;
  onClick?: () => void;
}

export function ConversationItem({ reply, onClick }: ConversationItemProps) {
  const promptPayload = reply.prompt_payload as {
    message?: string;
    additionalContext?: string;
    length?: string;
  };

  const message = promptPayload?.message || "";
  const preview = message.length > 100 ? `${message.substring(0, 100)}...` : message;
  const generatedReplyPreview =
    reply.model_response.length > 100
      ? `${reply.model_response.substring(0, 100)}...`
      : reply.model_response;

  const timeAgo = formatTimeAgo(new Date(reply.created_at));

  return (
    <Card
      onClick={onClick}
      className="rounded-xl border-border bg-card/80 p-3 sm:p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-medium text-foreground">
            {promptPayload?.message ? preview : "Generated Reply"}
          </h4>
          <span className="text-[0.8125rem] text-muted-foreground whitespace-nowrap">
            {timeAgo}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {generatedReplyPreview}
        </p>
        {reply.profile && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[0.8125rem] text-muted-foreground/70">Profile:</span>
            <span className="text-[0.8125rem] text-foreground">{reply.profile.name}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

