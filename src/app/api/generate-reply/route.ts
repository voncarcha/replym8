import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getAIClient, getModelName, type AIProvider } from "@/lib/openai-client";
import { createAdminClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, additionalContext, profileId, length, replyId, aiAgent = "groq" } = await req.json();

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

    // Step 4: Get profile information if profileId is provided
    let profileContext = "";
    let profilePreferredLength: string | null = null;
    let profileTags: string[] = [];
    
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
        
        profileContext = `
Profile: ${profile.name}
Relationship: ${profile.relationship_type}
Tone Preferences:
- Formality: ${tonePrefs.formality || "Not specified"}
- Friendliness: ${tonePrefs.friendliness || "Not specified"}
- Preferred Length: ${tonePrefs.preferredLength || "Not specified"}
- Emoji Usage: ${tonePrefs.emojiUsage || "Not specified"}
${profileTags.length > 0 ? `- Tags: ${profileTags.join(", ")}` : ""}
${profile.notes ? `Notes: ${profile.notes}` : ""}`;
      } else if (profile) {
        profileContext = `
Profile: ${profile.name}
Relationship: ${profile.relationship_type}
${profile.notes ? `Notes: ${profile.notes}` : ""}`;
      }
    }

    // Step 5: Generate reply using LLM
    // Use profile's preferred length if available, otherwise use the length parameter from UI
    const effectiveLength = profilePreferredLength 
      ? profilePreferredLength.toLowerCase() as "short" | "medium" | "long"
      : length;
    
    const lengthInstruction =
      effectiveLength === "short"
        ? "Keep the reply concise (2-3 sentences)."
        : effectiveLength === "medium"
        ? "Write a medium-length reply (1-2 paragraphs)."
        : "Write a detailed, longer reply (2-3 paragraphs).";

    const systemPrompt = `You are ReplyM8, an AI assistant that helps users write contextual, tone-appropriate email replies.
${profileContext ? `\nUse this profile information to match the tone and style:${profileContext}` : ""}

Guidelines:
- Match the tone and formality level of the profile
- ${lengthInstruction}
${profileTags.length > 0 ? `- Incorporate these style elements/tags: ${profileTags.join(", ")}` : ""}
- Write naturally and professionally
- Address the key points from the incoming message`;

    const userPrompt = `Incoming message to reply to:
${message}
${additionalContext ? `\nAdditional context and intent:\n${additionalContext}` : ""}

Generate an appropriate reply:`;

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: length === "short" ? 150 : length === "medium" ? 300 : 500,
    });

    const generatedReply =
      completion.choices[0]?.message?.content || "Failed to generate reply.";

    // Step 6: Save or update the generated reply to database
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
      }
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

