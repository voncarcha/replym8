"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/server";
import { GeneratedReplyWithProfile } from "@/types";

export async function getGeneratedReplies(): Promise<GeneratedReplyWithProfile[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Failed to create admin client:", error);
    throw new Error(
      "Server configuration error. Please check SUPABASE_SERVICE_ROLE_KEY environment variable."
    );
  }

  try {
    // Fetch generated replies for the current user with profile information
    const { data: replies, error: repliesError } = await supabase
      .from("generated_replies")
      .select(`
        *,
        profile:profiles(id, name)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (repliesError) {
      console.error("Error fetching generated replies:", repliesError);
      throw new Error(`Failed to fetch replies: ${repliesError.message}`);
    }

    if (!replies || replies.length === 0) {
      return [];
    }

    // Map the data to include profile information
    return replies.map((reply) => ({
      ...reply,
      profile: reply.profile || null,
    })) as GeneratedReplyWithProfile[];
  } catch (error) {
    console.error("Error in getGeneratedReplies:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Failed to fetch replies: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

