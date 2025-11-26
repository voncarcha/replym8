"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Send, Loader2, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TONE_PRESETS } from "@/lib/tone-presets";

type Length = "short" | "medium" | "long";

export function LandingGenerator() {
  const [message, setMessage] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [isReplyGenerated, setIsReplyGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [length, setLength] = useState<Length>("medium");
  const [emojiEnabled, setEmojiEnabled] = useState(false);
  const [selectedTonePreset, setSelectedTonePreset] = useState<string>("casual");
  const [error, setError] = useState<string | null>(null);
  const [remainingGenerations, setRemainingGenerations] = useState<number | null>(null);

  const handleGenerateReply = async () => {
    if (!message.trim()) return;

    setIsGenerating(true);
    setError(null);
    setIsReplyGenerated(false);

    try {
      const response = await fetch("/api/generate-reply-guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          additionalContext: additionalContext.trim() || undefined,
          length,
          emojiEnabled,
          tonePreset: selectedTonePreset,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.message || "Generation limit reached");
          toast.error(data.message || "You've reached the generation limit. Sign up to continue!");
        } else {
          throw new Error(data.error || "Failed to generate reply");
        }
        return;
      }

      setGeneratedReply(data.reply);
      setIsReplyGenerated(true);
      setRemainingGenerations(data.remainingGenerations ?? null);
      toast.success("Reply generated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error generating reply:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!generatedReply) return;

    try {
      await navigator.clipboard.writeText(generatedReply);
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    if (isReplyGenerated) {
      setIsReplyGenerated(false);
      setGeneratedReply("");
    }
  };

  return (
    <section id="try-it" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-10 sm:py-14 lg:py-20">
        <div className="text-center mb-8 sm:mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
            Try ReplyM8 for free
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Generate personalized replies in seconds. No sign-up required—test it now with up to 3 free generations.
          </p>
          {remainingGenerations !== null && remainingGenerations >= 0 && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 text-xs text-muted-foreground px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>
                {remainingGenerations} {remainingGenerations === 1 ? "generation" : "generations"} remaining
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]">
            {/* Left: Input */}
            <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">
                  Incoming message
                </label>
              </div>
              <div className="flex-1 flex flex-col min-h-0 mb-3">
                <textarea
                  className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-2 flex-1 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Paste the message you need to reply to..."
                  value={message}
                  onChange={(e) => handleMessageChange(e.target.value)}
                  maxLength={2000}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    Tip: include a few lines of previous context for best results.
                  </span>
                  <span>{message.length} / 2,000 chars</span>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-border shrink-0">
                <label className="text-sm font-medium text-foreground block">
                  Response instructions
                </label>
                <textarea
                  className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-2 min-h-20 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Add any additional context, intent, or specific instructions for the reply (e.g., 'I want to politely decline', 'Emphasize the deadline')..."
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  maxLength={500}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Optional: provide context or intent to guide the AI reply.
                  </span>
                  <span>{additionalContext.length} / 500 chars</span>
                </div>
              </div>
            </Card>

            {/* Right: Generated Reply */}
            <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">
                  Generated reply
                </label>
                <div className="inline-flex items-center gap-1 text-sm text-foreground">
                  <span>Tone</span>
                  <Select value={selectedTonePreset} onValueChange={setSelectedTonePreset}>
                    <SelectTrigger className="w-[180px] h-7 text-sm [&>span]:truncate [&>span]:text-left">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-[180px]">
                      {TONE_PRESETS.map((preset) => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background/80 p-3 flex-1 flex flex-col min-h-0 mb-3">
                <p className="text-sm text-foreground whitespace-pre-wrap flex-1 overflow-y-auto">
                  {isReplyGenerated
                    ? generatedReply
                    : message
                    ? "Click 'Generate reply' to create a response..."
                    : "Generated reply will appear here after you paste a message..."}
                </p>
              </div>

              <div className="inline-flex items-center gap-5 text-[0.7rem] text-muted-foreground mb-3">
                  <div className="inline-flex items-center gap-2">
                    <span>Length</span>
                    <div className="inline-flex items-center rounded-full border border-border bg-card overflow-hidden">
                      <button
                        onClick={() => setLength("short")}
                        className={cn(
                          "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                          length === "short"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        Short
                      </button>
                      <button
                        onClick={() => setLength("medium")}
                        className={cn(
                          "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                          length === "medium"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => setLength("long")}
                        className={cn(
                          "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                          length === "long"
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
                        onClick={() => setEmojiEnabled(false)}
                        className={cn(
                          "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                          !emojiEnabled
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        No
                      </button>
                      <button
                        onClick={() => setEmojiEnabled(true)}
                        className={cn(
                          "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
                          emojiEnabled
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              <div className="flex flex-wrap gap-2 items-center shrink-0">
                <div className="flex gap-2">
                  {!isReplyGenerated ? (
                    <Button
                      size="sm"
                      onClick={handleGenerateReply}
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
                        onClick={handleCopyToClipboard}
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
                        onClick={handleGenerateReply}
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
                            <Send className="h-3.5 w-3.5" />
                            Regenerate
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Error message and CTA Card - Below both cards */}
          <div className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-destructive">{error}</p>
                  {error.includes("limit") && (
                    <Link
                      href="/sign-up"
                      className="text-xs text-destructive underline mt-1 inline-block"
                    >
                      Sign up to continue generating replies
                    </Link>
                  )}
                </div>
              </div>
            )}
            
            {/* CTA Card */}
            {isReplyGenerated && (
              <Card className="rounded-xl border-border bg-card/70 p-4 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Love what you see? Sign up to unlock unlimited generations, profile management, and more.
                </p>
                <Button
                  asChild
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-500 text-white text-sm font-medium px-4 py-2 hover:bg-sky-400"
                >
                  <Link href="/sign-up">
                    Sign up for free
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

