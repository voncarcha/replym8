"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, Info, Send, Plus, FolderOpen, List, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProfileWithMembers, getProfiles } from "@/app/actions/profile";
import Link from "next/link";
import { toast } from "sonner";

type Mode = "reply" | "compose";
type Length = "short" | "medium" | "long";
type AIAgent = "groq" | "openai";

export default function ReplyGeneratorPage() {
  const [mode, setMode] = useState<Mode>("reply");
  const [length, setLength] = useState<Length>("short");
  const [aiAgent, setAiAgent] = useState<AIAgent>("groq");
  const [message, setMessage] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [generatedReply, setGeneratedReply] = useState("");
  const [isReplyGenerated, setIsReplyGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ProfileWithMembers[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Fetch profiles on mount using server action
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profilesData = await getProfiles();
        setProfiles(profilesData || []);
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
      } finally {
        setIsLoadingProfiles(false);
      }
    };

    fetchProfiles();
  }, []);

  // Get selected profile object
  const selectedProfileObj = profiles.find((p) => p.id === selectedProfile);

  const handleGenerateReply = async () => {
    if (!message.trim()) return;

    setIsGenerating(true);
    setError(null);
    setIsReplyGenerated(false);
    const isRegenerating = replyId !== null;
    toast.loading(isRegenerating ? "Regenerating reply..." : "Generating reply...", { id: "generating-reply" });

    try {
      const response = await fetch("/api/generate-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          additionalContext: additionalContext.trim() || undefined,
          profileId: selectedProfile,
          length,
          replyId: replyId, // Include replyId if regenerating
          aiAgent, // Include selected AI agent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate reply");
      }

      const data = await response.json();
      setGeneratedReply(data.reply);
      setIsReplyGenerated(true);
      // Store the reply ID if provided (for updates) or if it's a new reply
      if (data.replyId) {
        setReplyId(data.replyId);
      }
      toast.success(isRegenerating ? "Reply regenerated successfully!" : "Reply generated successfully!", { id: "generating-reply" });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage, { id: "generating-reply" });
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
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border">
        <div>
          <h3 className="text-sm sm:text-base font-medium tracking-tight text-foreground">
            Reply generator
          </h3>
          <p className="text-[0.7rem] sm:text-xs text-muted-foreground">
            Paste a message, compose from scratch, choose a profile, and fine-tune your reply.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <div className="inline-flex items-center gap-2 text-[0.7rem] text-muted-foreground">
            <span>Mode</span>
            <div className="inline-flex items-center rounded-full border border-border bg-card overflow-hidden">
              <button
                onClick={() => setMode("reply")}
                className={cn(
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors",
                  mode === "reply"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Reply
              </button>
              <button
                onClick={() => setMode("compose")}
                className={cn(
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors",
                  mode === "compose"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Compose
              </button>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-[0.7rem] text-muted-foreground">
            <span>Length</span>
            <div className="inline-flex items-center rounded-full border border-border bg-card overflow-hidden">
              <button
                onClick={() => setLength("short")}
                className={cn(
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors",
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
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors",
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
                  "px-2 py-1 text-[0.7rem] font-medium transition-colors",
                  length === "long"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Long
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "px-4 sm:px-5 pb-4 grid gap-4 overflow-y-auto pt-4",
          mode === "reply"
            ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]"
            : "lg:grid-cols-1"
        )}
      >
        {/* Left: input */}
        <div className="space-y-3">
          {mode === "reply" ? (
            <>
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
                  onChange={(e) => {
                    setMessage(e.target.value);
                    // Reset generated reply when message changes
                    if (isReplyGenerated) {
                      setIsReplyGenerated(false);
                      setGeneratedReply("");
                      setReplyId(null); // Reset reply ID when message changes
                    }
                  }}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Tip: include a few lines of previous context for best results.
                  </span>
                  <span>{message.length} / 2,000 chars</span>
                </div>
                <div className="space-y-2 pt-4 border-t border-border">
                  <label className="text-sm font-medium text-foreground block">
                    Additional context & intent
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-2 min-h-20 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Add any additional context, intent, or specific instructions for the reply (e.g., 'I want to politely decline', 'Emphasize the deadline', 'Keep it brief and friendly')..."
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Optional: provide context or intent to guide the AI reply.
                    </span>
                    <span>{additionalContext.length} / 500 chars</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  {error && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-muted-foreground whitespace-nowrap">
                        AI Agent
                      </label>
                      <Select value={aiAgent} onValueChange={(value) => setAiAgent(value as AIAgent)}>
                        <SelectTrigger className="w-[190px] h-8 text-sm [&>span]:truncate [&>span]:text-left">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="min-w-[190px]">
                          <SelectItem value="groq">Groq (llama-3.3-70b-versatile)</SelectItem>
                          <SelectItem value="openai">OpenAI (gpt-4o-mini)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Compose new message
                  </label>
                  <span className="text-sm text-muted-foreground">
                    Start from scratch with AI help.
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="rounded-full border border-border bg-card px-2 py-0.5">
                    Email
                  </span>
                  <span className="rounded-full border border-border bg-card px-2 py-0.5">
                    DM
                  </span>
                </div>
              </div>
              {/* To / Subject row */}
              <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]">
                  <div>
                    <label className="block text-muted-foreground text-sm">
                      To
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
                      <input
                        type="text"
                        className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                        placeholder="lena@company.com or pick from profiles"
                        value={composeTo}
                        onChange={(e) => setComposeTo(e.target.value)}
                      />
                      <button className="inline-flex items-center gap-1 rounded-md border border-border bg-card text-sm text-foreground px-1.5 py-0.5 hover:bg-muted transition-colors">
                        <FolderOpen className="h-3 w-3" />
                        Profiles
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-muted-foreground text-sm">
                      Subject
                    </label>
                    <input
                      className="mt-1 w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Roadmap risks for tomorrow's exec review"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* Compose body with toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Message body
                  </span>
                  <div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <button className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-0.5 hover:bg-muted transition-colors">
                      <List className="h-3 w-3" />
                      Outline
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-0.5 hover:bg-muted transition-colors">
                      <Plus className="h-3 w-3" />
                      Add points
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card/80">
                  {/* Tiny toolbar */}
                  <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <button className="inline-flex items-center justify-center h-5 w-5 rounded border border-border bg-background hover:bg-muted transition-colors">
                        <span className="text-sm font-medium">B</span>
                      </button>
                      <button className="inline-flex items-center justify-center h-5 w-5 rounded border border-border bg-background hover:bg-muted transition-colors">
                        <span className="text-sm font-medium">I</span>
                      </button>
                      <button className="inline-flex items-center justify-center h-5 w-5 rounded border border-border bg-background hover:bg-muted transition-colors">
                        <span className="text-sm font-medium">•</span>
                      </button>
                    </div>
                    <div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <List className="h-3 w-3" />
                      <span>Plain</span>
                    </div>
                  </div>
                  <textarea
                    className="w-full rounded-b-lg bg-transparent text-sm text-foreground px-2.5 py-2 min-h-24 focus:outline-none focus:ring-0"
                    placeholder="Draft what you want to say, or leave a rough idea and let ReplyM8 tighten it up."
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Hint: describe intent (status update, ask, follow-up) for
                    sharper drafts.
                  </span>
                  <span>{composeMessage.length} / 2,000 chars</span>
                </div>
              </div>
              {/* Compose actions */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 hover:bg-primary/90 h-auto"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Generate message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-3 py-1.5 hover:bg-muted h-auto"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Improve draft
                  </Button>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Compose mode ready
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Conversation upload drawer - only show in reply mode */}
          {mode === "reply" && (
            <Card className="rounded-xl border-dashed border-border bg-card/60 p-3 sm:p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <span>Drop screenshots or text threads</span>
              </div>
              <Button
                variant="outline"
                className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
              >
                Browse files
              </Button>
            </div>
            <div className="flex items-center justify-between text-[0.8125rem] text-muted-foreground">
              <span>OCR will extract context for this profile.</span>
              {profiles.length > 0 && (
                <div className="inline-flex items-center gap-1">
                  <span className="text-foreground">Link to profile</span>
                  <select
                    className="rounded-md border border-border bg-background text-[0.8125rem] text-foreground px-1.5 py-0.5"
                    value={selectedProfile || ""}
                    onChange={(e) => setSelectedProfile(e.target.value || null)}
                  >
                    <option value="">Select profile</option>
                    {profiles.map((profile) => {
                      let displayName = profile.name;
                      if (
                        profile.type === "group" &&
                        profile.members &&
                        profile.members.length > 0
                      ) {
                        const memberNames = profile.members
                          .slice(0, 2)
                          .map((m) => m.name)
                          .join(", ");
                        if (profile.members.length > 2) {
                          displayName = `${profile.name} · ${memberNames} +${
                            profile.members.length - 2
                          }`;
                        } else {
                          displayName = `${profile.name} · ${memberNames}`;
                        }
                      }
                      return (
                        <option key={profile.id} value={profile.id}>
                          {displayName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          </Card>
          )}
        </div>

        {/* Right: profile-select + output - only show in reply mode */}
        {mode === "reply" && (
          <div className="space-y-3">
            <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Recipient profile
                </label>
                <Button
                  variant="outline"
                  asChild
                  className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
                >
                  <Link href="/dashboard/profiles">Manage profiles</Link>
                </Button>
              </div>
              <select
                className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                value={selectedProfile || ""}
                onChange={(e) => {
                  setSelectedProfile(e.target.value || null);
                  // Reset generated reply when profile changes
                  if (isReplyGenerated) {
                    setIsReplyGenerated(false);
                    setGeneratedReply("");
                    setReplyId(null);
                  }
                }}
                disabled={isLoadingProfiles}
              >
                <option value="">Select a profile (optional)</option>
                {profiles.map((profile) => {
                  // Build display name similar to profile-list.tsx
                  let displayName = profile.name;
                  if (
                    profile.type === "group" &&
                    profile.members &&
                    profile.members.length > 0
                  ) {
                    const memberNames = profile.members
                      .slice(0, 2)
                      .map((m) => m.name)
                      .join(", ");
                    if (profile.members.length > 2) {
                      displayName = `${profile.name} · ${memberNames} +${
                        profile.members.length - 2
                      }`;
                    } else {
                      displayName = `${profile.name} · ${memberNames}`;
                    }
                  }
                  const relationshipType = profile.relationship_type || "Other";
                  return (
                    <option key={profile.id} value={profile.id}>
                      {displayName} ({relationshipType})
                    </option>
                  );
                })}
              </select>
              {selectedProfileObj && selectedProfileObj.tone_preferences && (
                <div className="flex flex-wrap gap-1.5 text-[0.8125rem] text-foreground">
                  {selectedProfileObj.tone_preferences.formality && (
                    <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                      {selectedProfileObj.tone_preferences.formality}
                    </span>
                  )}
                  {selectedProfileObj.tone_preferences.preferredLength && (
                    <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                      {selectedProfileObj.tone_preferences.preferredLength} replies
                    </span>
                  )}
                  {selectedProfileObj.tone_preferences.emojiUsage === "None" && (
                    <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                      No emojis
                    </span>
                  )}
                  {selectedProfileObj.tone_preferences.tags &&
                    selectedProfileObj.tone_preferences.tags.length > 0 &&
                    selectedProfileObj.tone_preferences.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-background/80 border border-border px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </Card>

            <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Generated reply
                </label>
                <div className="inline-flex items-center gap-1 text-sm text-foreground">
                  <span>Tone</span>
                  <select className="rounded-md border border-border bg-background text-sm text-foreground px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>Match profile</option>
                    <option>Softer</option>
                    <option>More direct</option>
                  </select>
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
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <div className="flex gap-2">
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
                        <RefreshCw className="h-3.5 w-3.5" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </div>
                <div className="inline-flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Ready to send
                  </span>
                  <button className="underline underline-offset-2 hover:text-foreground">
                    Improve opening
                  </button>
                </div>
              </div>
            </Card>

            {/* Small insight footer */}
            {selectedProfileObj && (
              <Card className="rounded-xl border-border bg-card/70 p-3 flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 text-sky-400 shrink-0" />
                <p>
                  ReplyM8 keeps this reply aligned with {selectedProfileObj.name}&apos;s profile and
                  similar past threads. You can still tweak tone or length before
                  copying.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
}
