"use client";

import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProfileWithMembers, getProfiles } from "@/app/actions/profile";
import { toast } from "sonner";
import { getTonePresetById } from "@/lib/tone-presets";
import { presetIdToTonePreferences } from "@/lib/tone-preset-utils";
// import { ModeToggle } from "@/components/shared/mode-toggle";
import { ReplyInputSection } from "@/components/shared/reply-input-section";
import { ComposeInputSection } from "@/components/shared/compose-input-section";
import { ProfileSelector } from "@/components/shared/profile-selector";
import { GeneratedReplySection } from "@/components/shared/generated-reply-section";

type Mode = "reply" | "compose";
type Length = "short" | "medium" | "long";
type AIAgent = "groq" | "openai";
type GroqModel = "llama-3.1-8b-instant" | "llama-3.3-70b-versatile";

export default function ReplyGeneratorPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mode, setMode] = useState<Mode>("reply");
  const [length, setLength] = useState<Length>("short");
  const [aiAgent, setAiAgent] = useState<AIAgent>("groq");
  const [groqModel, setGroqModel] = useState<GroqModel>("llama-3.1-8b-instant");
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
  const [selectedTonePreset, setSelectedTonePreset] = useState<string>("casual");
  const [isManualLength, setIsManualLength] = useState(false);
  const [emojiEnabled, setEmojiEnabled] = useState<boolean>(false);
  const [isManualEmoji, setIsManualEmoji] = useState(false);

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

  // Reset tone preset when profile changes
  useEffect(() => {
    if (selectedProfile) {
      setSelectedTonePreset("match-profile");
      setIsManualLength(false); // Reset manual length when profile changes to use profile's preferred length
      setIsManualEmoji(false); // Reset manual emoji when profile changes to use profile's preference
    } else {
      // If no profile selected, default to casual and reset manual flags
      setSelectedTonePreset("casual");
      setIsManualLength(false);
      setIsManualEmoji(false);
    }
  }, [selectedProfile]);

  // Helper function to convert emojiUsage to boolean
  const emojiUsageToBoolean = (emojiUsage: "None" | "Minimal" | "Allowed" | undefined): boolean => {
    return emojiUsage === "Allowed";
  };

  // Update length and emoji when tone preset changes
  useEffect(() => {
    if (selectedTonePreset !== "match-profile") {
      const preset = getTonePresetById(selectedTonePreset);
      if (preset) {
        const tonePrefs = presetIdToTonePreferences(selectedTonePreset, []);
        
        // Reset manual flags and update length/emoji immediately when preset changes
        setIsManualLength(false);
        setIsManualEmoji(false);
        
        const presetLength = tonePrefs.preferredLength.toLowerCase() as Length;
        const presetEmoji = emojiUsageToBoolean(tonePrefs.emojiUsage);
        
        setLength(presetLength);
        setEmojiEnabled(presetEmoji);
      }
    }
  }, [selectedTonePreset]);

  // Calculate effective length based on preset or profile, prioritizing manual selection
  const getEffectiveLength = (): Length => {
    // If user manually selected a length, use that
    if (isManualLength) {
      return length;
    }

    // If a specific preset is selected (not "match-profile"), use preset's preferred length
    if (selectedTonePreset !== "match-profile") {
      const preset = getTonePresetById(selectedTonePreset);
      if (preset) {
        const tonePrefs = presetIdToTonePreferences(selectedTonePreset, []);
        return (tonePrefs.preferredLength.toLowerCase() as Length);
      }
    }

    // If "match-profile" is selected and profile exists, use profile's preferred length
    if (selectedTonePreset === "match-profile" && selectedProfileObj?.tone_preferences?.preferredLength) {
      return (selectedProfileObj.tone_preferences.preferredLength.toLowerCase() as Length);
    }

    // Default to current length
    return length;
  };

  // Calculate effective emoji preference based on preset or profile, prioritizing manual selection
  const getEffectiveEmoji = (): boolean => {
    // If user manually selected emoji preference, use that
    if (isManualEmoji) {
      return emojiEnabled;
    }

    // If a specific preset is selected (not "match-profile"), use preset's emoji preference
    if (selectedTonePreset !== "match-profile") {
      const preset = getTonePresetById(selectedTonePreset);
      if (preset) {
        const tonePrefs = presetIdToTonePreferences(selectedTonePreset, []);
        return emojiUsageToBoolean(tonePrefs.emojiUsage);
      }
    }

    // If "match-profile" is selected and profile exists, use profile's emoji preference
    if (selectedTonePreset === "match-profile" && selectedProfileObj?.tone_preferences?.emojiUsage !== undefined) {
      return emojiUsageToBoolean(selectedProfileObj.tone_preferences.emojiUsage);
    }

    // Default to current emoji setting
    return emojiEnabled;
  };

  const effectiveLength = getEffectiveLength();
  const effectiveEmoji = getEffectiveEmoji();

  // Update length and emoji when profile changes (if not manually set and matching profile)
  useEffect(() => {
    if (selectedTonePreset === "match-profile" && selectedProfileObj?.tone_preferences) {
      // Update length if not manually set
      if (!isManualLength && selectedProfileObj.tone_preferences.preferredLength) {
        const profileLength = selectedProfileObj.tone_preferences.preferredLength.toLowerCase() as Length;
        if (profileLength !== length) {
          setLength(profileLength);
        }
      }
      
      // Update emoji if not manually set
      if (!isManualEmoji && selectedProfileObj.tone_preferences.emojiUsage !== undefined) {
        const profileEmoji = emojiUsageToBoolean(selectedProfileObj.tone_preferences.emojiUsage);
        if (profileEmoji !== emojiEnabled) {
          setEmojiEnabled(profileEmoji);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfileObj, isManualLength, isManualEmoji, selectedTonePreset]);

  const handleGenerateReply = async () => {
    // Allow generation if either message or additionalContext is provided
    const hasMessage = message.trim().length > 0;
    const hasAdditionalContext = additionalContext.trim().length > 0;
    
    if (!hasMessage && !hasAdditionalContext) return;

    setIsGenerating(true);
    setError(null);
    setIsReplyGenerated(false);
    const isRegenerating = replyId !== null;

    try {
      const response = await fetch("/api/generate-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: hasMessage ? message : undefined,
          additionalContext: hasAdditionalContext ? additionalContext.trim() : undefined,
          profileId: selectedProfile,
          length: effectiveLength,
          emojiEnabled: effectiveEmoji,
          replyId: replyId, // Include replyId if regenerating
          aiAgent, // Include selected AI agent
          model: aiAgent === "groq" ? groqModel : undefined, // Include model if Groq
          tonePreset: selectedTonePreset !== "match-profile" ? selectedTonePreset : undefined, // Only send if not matching profile
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
      toast.success(isRegenerating ? "Reply regenerated successfully!" : "Reply generated successfully!");
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
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleLengthChange = (newLength: Length) => {
    setLength(newLength);
    setIsManualLength(true);
  };

  const handleEmojiChange = (enabled: boolean) => {
    setEmojiEnabled(enabled);
    setIsManualEmoji(true);
  };

  const handleMessageChange = (value: string) => {
    setMessage(value);
    // Reset generated reply when message changes
    if (isReplyGenerated) {
      setIsReplyGenerated(false);
      setGeneratedReply("");
      setReplyId(null); // Reset reply ID when message changes
    }
  };

  const handleProfileChange = (profileId: string | null) => {
    setSelectedProfile(profileId);
    // Reset generated reply when profile changes
    if (isReplyGenerated) {
      setIsReplyGenerated(false);
      setGeneratedReply("");
      setReplyId(null);
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
        {/* <div className="flex flex-wrap items-center gap-5">
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div> */}
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
            <ReplyInputSection
              message={message}
              onMessageChange={handleMessageChange}
              additionalContext={additionalContext}
              onAdditionalContextChange={setAdditionalContext}
              aiAgent={aiAgent}
              onAIAgentChange={setAiAgent}
              groqModel={groqModel}
              onGroqModelChange={setGroqModel}
              error={error}
            />
          ) : (
            <ComposeInputSection
              composeTo={composeTo}
              onComposeToChange={setComposeTo}
              composeSubject={composeSubject}
              onComposeSubjectChange={setComposeSubject}
              composeMessage={composeMessage}
              onComposeMessageChange={setComposeMessage}
            />
          )}

          {/* Conversation upload drawer - only show in reply mode */}
          {/* {mode === "reply" && (
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
          )} */}

        </div>

        {/* Right: profile-select + output - only show in reply mode */}
        {mode === "reply" && (
          <div className="space-y-3">
            <ProfileSelector
              profiles={profiles}
              selectedProfile={selectedProfile}
              onProfileChange={handleProfileChange}
              isLoadingProfiles={isLoadingProfiles}
            />

            <GeneratedReplySection
              selectedTonePreset={selectedTonePreset}
              onTonePresetChange={setSelectedTonePreset}
              selectedProfile={selectedProfile}
              generatedReply={generatedReply}
              message={message}
              additionalContext={additionalContext}
              isReplyGenerated={isReplyGenerated}
              isGenerating={isGenerating}
              isCopied={isCopied}
              effectiveLength={effectiveLength}
              effectiveEmoji={effectiveEmoji}
              onLengthChange={handleLengthChange}
              onEmojiChange={handleEmojiChange}
              onGenerateReply={handleGenerateReply}
              onCopyToClipboard={handleCopyToClipboard}
            />

            {/* Small insight footer */}
            {selectedProfileObj && (
              <Card className="rounded-xl border-border bg-card/70 p-3 flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 text-sky-400 shrink-0" />
                <p>
                  ReplyM8 keeps this reply aligned with {selectedProfileObj.name}&apos;s profile and
                  similar past threads. You can still tweak tone, length or emoji usage before
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
