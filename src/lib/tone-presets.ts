export interface TonePreset {
  id: string;
  name: string;
  description: string;
  tags: string[];
  llmInstruction: string;
}

export const TONE_PRESETS: TonePreset[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clear, respectful, concise, no slang.",
    tags: ["business", "work", "formal-lite", "clear", "no-slang", "client-safe"],
    llmInstruction: "Maintain a professional tone: clear, respectful, and business-appropriate.",
  },
  {
    id: "friendly",
    name: "Friendly",
    description: "Warm, casual, approachable.",
    tags: ["warm", "casual", "approachable", "positive", "neutral"],
    llmInstruction: "Use a warm and friendly tone, casual but still respectful.",
  },
  {
    id: "formal",
    name: "Formal",
    description: "Polite, structured, polished, \"corporate official.\"",
    tags: ["polite", "formal", "structured", "corporate", "official"],
    llmInstruction: "Maintain a formal and polished tone with complete structured sentences.",
  },
  {
    id: "casual",
    name: "Casual",
    description: "Simple, relaxed, everyday natural speech.",
    tags: ["relaxed", "simple", "everyday", "light", "social"],
    llmInstruction: "Keep the tone casual and relaxed with natural flow.",
  },
  {
    id: "empathetic",
    name: "Empathetic",
    description: "Caring, emotionally aware, gentle.",
    tags: ["supportive", "soft", "emotional", "caring", "sensitive"],
    llmInstruction: "Use a gentle and empathetic tone that shows care and understanding.",
  },
  {
    id: "direct",
    name: "Direct / No-BS",
    description: "Straight to the point, no fluff, efficient.",
    tags: ["direct", "concise", "efficient", "brief", "assertive"],
    llmInstruction: "Use a direct and concise tone, avoiding unnecessary fluff.",
  },
  {
    id: "short-snappy",
    name: "Short & Snappy",
    description: "Extremely brief, fast, cut-to-the-chase.",
    tags: ["brief", "short", "quick", "minimal", "efficient"],
    llmInstruction: "Keep the message extremely short and to the point.",
  },
  {
    id: "playful",
    name: "Playful",
    description: "Fun, light, a bit humorous, expressive.",
    tags: ["fun", "humor", "lighthearted", "emoji-optional", "social"],
    llmInstruction: "Use a playful tone with light humor and casual energy.",
  },
  {
    id: "supportive-leadership",
    name: "Supportive Leadership",
    description: "Encouraging, confident, calm authority.",
    tags: ["leadership", "motivational", "mentor", "guidance", "positive-authority"],
    llmInstruction: "Use an encouraging leadership tone, supportive and empowering.",
  },
  {
    id: "academic",
    name: "Academic / Structured",
    description: "Logical, organized, objective language.",
    tags: ["academic", "structured", "logical", "organized", "formal"],
    llmInstruction: "Maintain an academic tone with clear structure and objective reasoning.",
  },
];

export function getTonePresetById(id: string): TonePreset | undefined {
  return TONE_PRESETS.find((preset) => preset.id === id);
}

export function getTonePresetByName(name: string): TonePreset | undefined {
  return TONE_PRESETS.find((preset) => preset.name === name);
}

