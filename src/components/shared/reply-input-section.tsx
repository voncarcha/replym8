"use client";

import { Card } from "@/components/ui/card";
import { AIAgentSelector } from "./ai-agent-selector";

type AIAgent = "groq" | "openai";

interface ReplyInputSectionProps {
  message: string;
  onMessageChange: (value: string) => void;
  additionalContext: string;
  onAdditionalContextChange: (value: string) => void;
  aiAgent: AIAgent;
  onAIAgentChange: (value: AIAgent) => void;
  error: string | null;
}

export function ReplyInputSection({
  message,
  onMessageChange,
  additionalContext,
  onAdditionalContextChange,
  aiAgent,
  onAIAgentChange,
  error,
}: ReplyInputSectionProps) {
  return (
    <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Incoming message
        </label>
        <div className="inline-flex items-center gap-2 text-sm text-foreground">
          <span className="rounded-full bg-muted px-2 py-0.5">
            Email
          </span>
          <span className="rounded-full border border-border bg-card px-2 py-0.5">
            Chat
          </span>
        </div>
      </div>
      <textarea
        className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-2 min-h-24 focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Paste the message you need to reply to..."
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Tip: include a few lines of previous context for best results.
        </span>
        <span>{message.length} / 2,000 chars</span>
      </div>
      <div className="space-y-2 pt-4 border-t border-border">
        <label className="text-sm font-medium text-foreground block">
          Response instructions
        </label>
        <textarea
          className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-2 min-h-20 focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Add any additional context, intent, or specific instructions for the reply (e.g., 'I want to politely decline', 'Emphasize the deadline')..."
          value={additionalContext}
          onChange={(e) => onAdditionalContextChange(e.target.value)}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Optional: provide context or intent to guide the AI reply.
          </span>
          <span>{additionalContext.length} / 500 chars</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <AIAgentSelector value={aiAgent} onValueChange={onAIAgentChange} />
        </div>
      </div>
    </Card>
  );
}

