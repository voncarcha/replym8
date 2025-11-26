import { TONE_PRESETS, getTonePresetById } from "./tone-presets";
import { TonePreferences } from "@/types";

// Helper function to convert tone_preferences to preset ID
// This tries to match based on tags, preferring the preset with the most matching tags
export function tonePreferencesToPresetId(tonePrefs: TonePreferences): "professional" | "friendly" | "formal" | "casual" | "empathetic" | "direct" | "short-snappy" | "playful" | "supportive-leadership" | "academic" {
  if (!tonePrefs.tags || tonePrefs.tags.length === 0) {
    return "professional"; // Default
  }

  // Find the preset with the most matching tags
  let bestMatch: { presetId: string; matchCount: number } | null = null;
  
  for (const preset of TONE_PRESETS) {
    const matchingTags = preset.tags.filter((tag) => tonePrefs.tags.includes(tag));
    const matchCount = matchingTags.length;
    
    // Require at least 2 matching tags
    if (matchCount >= 2) {
      // If this is a better match (more tags), or first valid match, use it
      if (!bestMatch || matchCount > bestMatch.matchCount) {
        bestMatch = {
          presetId: preset.id,
          matchCount: matchCount,
        };
      }
    }
  }

  // Return the best match, or default to professional
  if (bestMatch) {
    return bestMatch.presetId as typeof bestMatch.presetId & ("professional" | "friendly" | "formal" | "casual" | "empathetic" | "direct" | "short-snappy" | "playful" | "supportive-leadership" | "academic");
  }

  // Default to professional if no match
  return "professional";
}

// Helper function to convert preset ID to tone_preferences format
export function presetIdToTonePreferences(presetId: string, customTags: string[]): TonePreferences {
  const preset = getTonePresetById(presetId);
  if (!preset) {
    // Fallback to professional if preset not found
    const defaultPreset = TONE_PRESETS[0];
    return {
      formality: "Neutral",
      friendliness: "Neutral",
      preferredLength: "Medium",
      emojiUsage: "Minimal",
      tags: [...defaultPreset.tags, ...customTags],
    };
  }

  // Map preset to tone preferences
  // We'll infer formality, friendliness, preferredLength, and emojiUsage from the preset
  let formality: "Formal" | "Neutral" | "Casual" = "Neutral";
  let friendliness: "Friendly" | "Neutral" | "Reserved" = "Neutral";
  let preferredLength: "Short" | "Medium" | "Long" = "Medium";
  let emojiUsage: "None" | "Minimal" | "Allowed" = "Minimal";

  // Map presets to tone preferences
  switch (presetId) {
    case "professional":
      formality = "Neutral";
      friendliness = "Neutral";
      preferredLength = "Medium";
      emojiUsage = "None";
      break;
    case "friendly":
      formality = "Casual";
      friendliness = "Friendly";
      preferredLength = "Medium";
      emojiUsage = "Minimal";
      break;
    case "formal":
      formality = "Formal";
      friendliness = "Reserved";
      preferredLength = "Long";
      emojiUsage = "None";
      break;
    case "casual":
      formality = "Casual";
      friendliness = "Friendly";
      preferredLength = "Medium";
      emojiUsage = "Allowed";
      break;
    case "empathetic":
      formality = "Neutral";
      friendliness = "Friendly";
      preferredLength = "Medium";
      emojiUsage = "Minimal";
      break;
    case "direct":
      formality = "Neutral";
      friendliness = "Reserved";
      preferredLength = "Short";
      emojiUsage = "None";
      break;
    case "short-snappy":
      formality = "Casual";
      friendliness = "Neutral";
      preferredLength = "Short";
      emojiUsage = "None";
      break;
    case "playful":
      formality = "Casual";
      friendliness = "Friendly";
      preferredLength = "Medium";
      emojiUsage = "Allowed";
      break;
    case "supportive-leadership":
      formality = "Neutral";
      friendliness = "Friendly";
      preferredLength = "Medium";
      emojiUsage = "Minimal";
      break;
    case "academic":
      formality = "Formal";
      friendliness = "Reserved";
      preferredLength = "Long";
      emojiUsage = "None";
      break;
  }

  // Combine preset tags with custom tags, removing duplicates
  const allTags = [...preset.tags];
  customTags.forEach((tag) => {
    if (!allTags.includes(tag)) {
      allTags.push(tag);
    }
  });

  return {
    formality,
    friendliness,
    preferredLength,
    emojiUsage,
    tags: allTags,
  };
}

