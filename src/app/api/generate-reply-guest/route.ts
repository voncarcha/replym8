import { NextRequest, NextResponse } from "next/server";
import { getAIClient, getModelName, type AIProvider } from "@/lib/openai-client";
import { cookies } from "next/headers";
import { getTonePresetById } from "@/lib/tone-presets";

const GUEST_GENERATION_LIMIT = 3;
const COOKIE_NAME = "guest_generation_count";
const COOKIE_EXPIRY_DAYS = 1; // Reset daily

async function getGuestGenerationCount(): Promise<number> {
  const cookieStore = await cookies();
  const countCookie = cookieStore.get(COOKIE_NAME);
  return countCookie ? parseInt(countCookie.value, 10) : 0;
}

export async function POST(req: NextRequest) {
  try {
    // Check generation limit
    const currentCount = await getGuestGenerationCount();
    if (currentCount >= GUEST_GENERATION_LIMIT) {
      return NextResponse.json(
        {
          error: "Generation limit reached",
          message: `You've reached the limit of ${GUEST_GENERATION_LIMIT} free generations. Sign up to continue generating replies!`,
        },
        { status: 429 }
      );
    }

    const {
      message,
      additionalContext,
      length = "medium",
      emojiEnabled = false,
      tonePreset = "casual",
    } = await req.json();

    // Message is required unless additionalContext is provided (free compose mode)
    const hasMessage = message && typeof message === "string" && message.trim().length > 0;
    const hasAdditionalContext = additionalContext && typeof additionalContext === "string" && additionalContext.trim().length > 0;
    
    if (!hasMessage && !hasAdditionalContext) {
      return NextResponse.json(
        { error: "Either a message or response instructions are required" },
        { status: 400 }
      );
    }

    // Use Groq with llama-3.1-8b-instant (hardcoded for guests)
    const aiProvider: AIProvider = "groq";
    const client = getAIClient(aiProvider);
    const modelName = getModelName(aiProvider, "llama-3.1-8b-instant");

    // Get tone preset if provided
    const preset = getTonePresetById(tonePreset);
    const llmInstruction = preset?.llmInstruction || "";

    // Humanization system prompt for guest users (no profile context)
    const systemPrompt = `You are a human writing natural, casual messages.

Your replies should:
- Vary sentence length (short, medium, long).
- Include light imperfections: mild hesitations, filler words ("yeah", "hmm", "actually", "I think").
- Use natural phrasing, contractions ("I'm", "that's", "can't").
- Avoid overly formal structures.
- Avoid robotic transitions ("Furthermore", "In conclusion").
- Add subtle personality, warmth, and context awareness.
- Be concise unless user asks otherwise.
${emojiEnabled ? "- MUST include emojis in your reply. Use 1-3 relevant emojis naturally throughout the message to add warmth and expressiveness." : "- Do NOT use any emojis in your reply."}
- Never mention you're an AI or model.
- Respond exactly like a real person texting or emailing.

If the user writes casually, match their tone. If the user writes formally, match it but keep it human.
${llmInstruction ? `\n\nTone instruction: ${llmInstruction}` : ""}
${emojiEnabled ? "\n\nCRITICAL: Emoji usage is REQUIRED. You MUST include 1-3 relevant emojis in your reply. Use emojis naturally to express emotion, add warmth, and make the message feel more human and engaging. Examples: 😊 👍 🎉 💯 ✨ 🔥 💪" : "\n\nCRITICAL: Emoji usage is FORBIDDEN. Do NOT use any emojis whatsoever in your reply."}

ALWAYS output only the ready-to-send reply message. No explanations.`;

    // Construct user prompt
    const userPrompt = `${hasMessage ? `Here is the incoming message:\n\n"${message}"` : "The user wants to compose a new message from scratch."}
${hasAdditionalContext ? `\n\nResponse instructions and context:\n${additionalContext}` : ""}

Here are the user's settings:

Tone: ${preset?.name || "Casual"}
Length: ${length}
Emoji: ${emojiEnabled ? "REQUIRED - You MUST include 1-3 emojis in your reply" : "FORBIDDEN - Do NOT use any emojis"}

${hasMessage ? "Generate the best possible reply." : "Generate a message based on the response instructions provided above."}`;

    const completion = await client.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens:
        length === "short" ? 150 : length === "medium" ? 300 : 500,
    });

    const generatedReply =
      completion.choices[0]?.message?.content || "Failed to generate reply.";

    // Increment generation count and set cookie
    const newCount = currentCount + 1;
    const response = NextResponse.json({
      reply: generatedReply,
      remainingGenerations: GUEST_GENERATION_LIMIT - newCount,
    });

    // Set cookie with the new count
    response.cookies.set(COOKIE_NAME, newCount.toString(), {
      maxAge: 60 * 60 * 24 * COOKIE_EXPIRY_DAYS, // 1 day
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error generating guest reply:", error);
    return NextResponse.json(
      {
        error: "Failed to generate reply",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

