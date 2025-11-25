import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  getAIClient,
  getModelName,
  type AIProvider,
} from "@/lib/openai-client";
import { createAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      message,
      additionalContext,
      profileId,
      length,
      replyId,
      aiAgent = "groq",
    } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // TODO: Embeddings and vector search - commented out for now
    // Step 1: Generate embedding for the incoming message
    // const openai = getOpenAIClient();
    // let vector: number[];
    //
    // try {
    //   const embeddingResponse = await openai.embeddings.create({
    //     model: "text-embedding-3-small",
    //     input: message,
    //   });
    //   vector = embeddingResponse.data[0].embedding;
    // } catch (err: unknown) {
    //   console.error("Embedding error:", err);
    //   const error = err as { code?: string; message?: string };
    //   if (error.code === "insufficient_quota") {
    //     return NextResponse.json(
    //       { ok: false, error: "Your OpenAI quota has been exceeded. Please upgrade your plan or add billing credits." },
    //       { status: 429 }
    //     );
    //   }
    //   return NextResponse.json(
    //     { ok: false, error: "Unexpected error generating embedding.", details: error?.message },
    //     { status: 500 }
    //   );
    // }

    // Step 2: Perform pgvector similarity search
    // const supabase = createAdminClient();
    // let similarMemories = null;
    // try {
    //   const { data, error: searchError } = await supabase.rpc("match_messages", {
    //     query_embedding: vector,
    //     match_threshold: 0.8,
    //     match_count: 5,
    //     profile_id: profileId || null,
    //   });
    //   if (!searchError) {
    //     similarMemories = data;
    //   }
    // } catch (error) {
    //   console.warn("Vector search not available:", error);
    // }

    // Step 3: Build context from similar memories
    // const contextMessages = similarMemories
    //   ? similarMemories.map((mem: { text_summary: string }) => mem.text_summary).join("\n\n")
    //   : "";

    // Get the appropriate AI client based on selected provider (default: groq)
    const aiProvider = (aiAgent === "openai" ? "openai" : "groq") as AIProvider;
    const client = getAIClient(aiProvider);
    const model = getModelName(aiProvider);
    const supabase = createAdminClient();

    // Fetch the user's recent messages from generated_replies
    // Filter by profile_id if provided, so each profile only uses its own history
    // Limit to 5 messages to balance context vs prompt length
    // Including model_response helps AI learn from previous generated replies for consistency
    const HISTORY_LIMIT = 5;
    
    let historyQuery = supabase
      .from("generated_replies")
      .select("prompt_payload, model_response, created_at")
      .eq("user_id", userId);

    if (profileId) {
      historyQuery = historyQuery.eq("profile_id", profileId);
    }

    const { data: history } = await historyQuery
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT);

    // Convert them into LLM-readable conversation history
    const conversationHistory = history
      ? history
          .reverse() // oldest → newest
          .map((item) => {
            const promptPayload = item.prompt_payload as { message?: string };
            const userMessage = promptPayload?.message || "";
            const assistantReply = item.model_response || "";
            return `User: ${userMessage}\nAssistant: ${assistantReply}`;
          })
          .join("\n\n")
      : "";

    // Get profile information if profileId is provided
    let profileContext = "";
    let profilePreferredLength: string | null = null;
    let profileTags: string[] = [];
    let tone = "";

    if (profileId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, tone_preferences, relationship_type, notes")
        .eq("id", profileId)
        .eq("user_id", userId)
        .single();

      if (profile && profile.tone_preferences) {
        const tonePrefs = profile.tone_preferences;
        profilePreferredLength = tonePrefs.preferredLength || null;
        profileTags = tonePrefs.tags || [];

        // Construct tone string from formality and friendliness
        const formality = tonePrefs.formality || "Not specified";
        const friendliness = tonePrefs.friendliness || "Not specified";
        tone = `${formality}, ${friendliness}`;

        profileContext = `
Profile: ${profile.name}
Relationship: ${profile.relationship_type}
Tone Preferences:
- Formality: ${formality}
- Friendliness: ${friendliness}
- Preferred Length: ${tonePrefs.preferredLength || "Not specified"}
- Emoji Usage: ${tonePrefs.emojiUsage || "Not specified"}
${profileTags.length > 0 ? `- Tags: ${profileTags.join(", ")}` : ""}
${profile.notes ? `Notes: ${profile.notes}` : ""}`;
      } else if (profile) {
        profileContext = `
Profile: ${profile.name}
Relationship: ${profile.relationship_type}
${profile.notes ? `Notes: ${profile.notes}` : ""}`;
        tone = "Not specified";
      }
    } else {
      tone = "Not specified";
    }

    // Generate reply using LLM
    // Use profile's preferred length if available, otherwise use the length parameter from UI
    const effectiveLength = profilePreferredLength
      ? (profilePreferredLength.toLowerCase() as "short" | "medium" | "long")
      : length;

    // Use history-aware system prompt for both Groq and OpenAI
    const systemPrompt = `You are ReplyMate AI, a personalized reply generator.

You have access to the user's past message history. Use it to understand:
- The user's writing style
- The tone they prefer (friendly, professional, concise, etc.)
- Their typical phrasing patterns
- Any recurring context (projects, people, tasks, etc.)

Rules for using past messages:
1. Use history ONLY to improve tone and context understanding.
2. Never reference past messages directly ("based on previous messages…").
3. Never quote earlier conversations.
4. Never reveal or describe the history to the user.
5. If the history is empty, reply normally.
6. Maintain consistent tone with previous user interactions.
7. Generate a reply that matches the requested tone, length, and tags.
${profileContext ? `\n\nProfile context:${profileContext}` : ""}

ALWAYS output only the ready-to-send reply message. No explanations.`;

    // Construct user prompt with conversation history for both providers
    const userPrompt = `Here is the user's past conversation history (do not reveal this to the user):

${conversationHistory || "(No previous conversation history)"}

Here is the new incoming message:

"${message}"
${additionalContext ? `\n\nAdditional context and intent:\n${additionalContext}` : ""}

Here are the user's settings:

Tone: ${tone}
Length: ${effectiveLength}
Tags: ${profileTags.join(", ") || "None"}

Generate the best possible reply.`;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens:
        effectiveLength === "short"
          ? 150
          : effectiveLength === "medium"
          ? 300
          : 500,
    });

    const generatedReply =
      completion.choices[0]?.message?.content || "Failed to generate reply.";

    // Save or update the generated reply to database
    let savedReplyId: string | null = null;
    if (profileId) {
      if (replyId) {
        // Update existing reply
        const { data, error: updateError } = await supabase
          .from("generated_replies")
          .update({
            prompt_payload: {
              message,
              additionalContext: additionalContext || null,
              length,
              systemPrompt,
              userPrompt,
              profileId,
            },
            model_response: generatedReply,
          })
          .eq("id", replyId)
          .eq("user_id", userId)
          .select("id")
          .single();

        if (!updateError && data) {
          savedReplyId = data.id;
        } else {
          console.error("Error updating reply:", updateError);
        }
      } else {
        // Insert new reply
        const { data, error: insertError } = await supabase
          .from("generated_replies")
          .insert({
            profile_id: profileId,
            user_id: userId,
            prompt_payload: {
              message,
              additionalContext: additionalContext || null,
              length,
              systemPrompt,
              userPrompt,
              profileId,
            },
            model_response: generatedReply,
          })
          .select("id")
          .single();

        if (!insertError && data) {
          savedReplyId = data.id;
        } else {
          console.error("Error inserting reply:", insertError);
        }
      }
    }

    return NextResponse.json({
      reply: generatedReply,
      replyId: savedReplyId,
      // Include systemPrompt in response for debugging (optional - remove in production if needed)
      debug: {
        systemPrompt,
        userPrompt,
        profileId: profileId || null,
        lengthUsed: effectiveLength,
        uiLength: length,
        profilePreferredLength: profilePreferredLength || null,
        aiProvider,
        model,
      },
    });
  } catch (error) {
    console.error("Error generating reply:", error);
    return NextResponse.json(
      {
        error: "Failed to generate reply",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
