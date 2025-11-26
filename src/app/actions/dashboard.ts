"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/server";
import { Profile } from "@/types";

export interface TodayUsageStats {
  repliesCount: number;
  profilesUsed: number;
  totalProfiles: number;
  averageLength: string;
  averageWordCount: number;
  repliesCountVsAvg: number | null; // Difference vs average (can be null if no historical data)
}

export async function getTodayUsageStats(): Promise<TodayUsageStats> {
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
    // Get start of today (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStart = today.toISOString();

    // Get end of today (UTC)
    const todayEnd = new Date(today);
    todayEnd.setUTCHours(23, 59, 59, 999);
    const todayEndISO = todayEnd.toISOString();

    // Count replies generated today
    const { count: repliesCount, error: repliesError } = await supabase
      .from("generated_replies")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", todayStart)
      .lte("created_at", todayEndISO);

    if (repliesError) {
      console.error("Error counting today's replies:", repliesError);
    }

    // Get unique profiles used today
    const { data: todayReplies } = await supabase
      .from("generated_replies")
      .select("profile_id")
      .eq("user_id", userId)
      .gte("created_at", todayStart)
      .lte("created_at", todayEndISO)
      .not("profile_id", "is", null);

    const uniqueProfilesUsed = todayReplies
      ? new Set(todayReplies.map((r) => r.profile_id).filter(Boolean)).size
      : 0;

    // Get total profiles count
    const { count: totalProfiles, error: totalProfilesError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (totalProfilesError) {
      console.error("Error counting total profiles:", totalProfilesError);
    }

    // Get all replies today to calculate average length
    const { data: allTodayReplies } = await supabase
      .from("generated_replies")
      .select("model_response, prompt_payload")
      .eq("user_id", userId)
      .gte("created_at", todayStart)
      .lte("created_at", todayEndISO);

    let averageLength = "Short";
    let averageWordCount = 0;

    if (allTodayReplies && allTodayReplies.length > 0) {
      // Calculate average word count from model_response
      const totalWords = allTodayReplies.reduce((sum, reply) => {
        const words = reply.model_response?.split(/\s+/).filter(Boolean).length || 0;
        return sum + words;
      }, 0);

      averageWordCount = Math.round(totalWords / allTodayReplies.length);

      // Determine length category
      if (averageWordCount < 50) {
        averageLength = "Short";
      } else if (averageWordCount < 150) {
        averageLength = "Medium";
      } else {
        averageLength = "Long";
      }
    }

    // Calculate average replies per day (last 7 days excluding today)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString();

    const { count: pastWeekReplies } = await supabase
      .from("generated_replies")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgoISO)
      .lt("created_at", todayStart);

    let repliesCountVsAvg: number | null = null;
    if (pastWeekReplies !== null && pastWeekReplies > 0) {
      const avgRepliesPerDay = pastWeekReplies / 7;
      repliesCountVsAvg = Math.round((repliesCount || 0) - avgRepliesPerDay);
    }

    return {
      repliesCount: repliesCount || 0,
      profilesUsed: uniqueProfilesUsed,
      totalProfiles: totalProfiles || 0,
      averageLength,
      averageWordCount,
      repliesCountVsAvg,
    };
  } catch (error) {
    console.error("Error in getTodayUsageStats:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Failed to fetch usage stats: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getRecentProfiles(limit: number = 2): Promise<Profile[]> {
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
    // Fetch recent profiles, ordered by created_at (most recently created first)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (profilesError) {
      console.error("Error fetching recent profiles:", profilesError);
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    return profiles || [];
  } catch (error) {
    console.error("Error in getRecentProfiles:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Failed to fetch profiles: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

