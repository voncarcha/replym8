"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, Send, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TONE_PRESETS } from "@/lib/tone-presets";

type Length = "short" | "medium" | "long";

interface GeneratedReplySectionProps {
  selectedTonePreset: string;
  onTonePresetChange: (value: string) => void;
  selectedProfile: string | null;
  generatedReply: string;
  message: string;
  isReplyGenerated: boolean;
  isGenerating: boolean;
  isCopied: boolean;
  effectiveLength: Length;
  effectiveEmoji: boolean;
  onLengthChange: (length: Length) => void;
  onEmojiChange: (enabled: boolean) => void;
  onGenerateReply: () => void;
  onCopyToClipboard: () => void;
}

export function GeneratedReplySection({
  selectedTonePreset,
  onTonePresetChange,
  selectedProfile,
  generatedReply,
  message,
  isReplyGenerated,
  isGenerating,
  isCopied,
  effectiveLength,
  effectiveEmoji,
  onLengthChange,
  onEmojiChange,
  onGenerateReply,
  onCopyToClipboard,
}: GeneratedReplySectionProps) {
  return (
    <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Generated reply
        </label>
        <div className="inline-flex items-center gap-1 text-sm text-foreground">
          <span>Tone</span>
          <Select value={selectedTonePreset} onValueChange={onTonePresetChange}>
            <SelectTrigger className="w-[180px] h-7 text-sm [&>span]:truncate [&>span]:text-left">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[180px]">
              {selectedProfile && (
                <SelectItem value="match-profile">Match profile</SelectItem>
              )}
              {TONE_PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-background/80 p-3 min-h-28">
        <p className="text-sm text-foreground whitespace-pre-wrap">
          {isReplyGenerated
            ? generatedReply
            : message
            ? "Click 'Generate reply' to create a response..."
            : "Generated reply will appear here after you paste a message..."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-2">
          {!isReplyGenerated ? (
            <Button
              size="sm"
              onClick={onGenerateReply}
              disabled={!message.trim() || isGenerating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 hover:bg-primary/90 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Generate reply
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                onClick={onCopyToClipboard}
                disabled={!isReplyGenerated || !generatedReply}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium px-2.5 py-1.5 hover:bg-primary/90 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onGenerateReply}
                disabled={!message.trim() || isGenerating}
                className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate
                  </>
                )}
              </Button>
            </>
          )}
        </div>
        <div className="inline-flex items-center gap-5 text-[0.7rem] text-muted-foreground ml-auto">
          <div className="inline-flex items-center gap-2">
            <span>Length</span>
            <div className="inline-flex items-center rounded-full border border-border bg-card overflow-hidden">
              <button
                onClick={() => onLengthChange("short")}
                className={cn(
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                  effectiveLength === "short"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Short
              </button>
              <button
                onClick={() => onLengthChange("medium")}
                className={cn(
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                  effectiveLength === "medium"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Medium
              </button>
              <button
                onClick={() => onLengthChange("long")}
                className={cn(
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                  effectiveLength === "long"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Long
              </button>
            </div>
          </div>
          <div className="inline-flex items-center gap-2">
            <span>Emoji</span>
            <div className="inline-flex items-center rounded-full border border-border bg-card overflow-hidden">
              <button
                onClick={() => onEmojiChange(false)}
                className={cn(
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                  !effectiveEmoji
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                No
              </button>
              <button
                onClick={() => onEmojiChange(true)}
                className={cn(
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                  effectiveEmoji
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

