"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/server";
import { CreateProfileInput, Profile, ProfileMember } from "@/types";

export async function createProfile(
  profileData: CreateProfileInput,
  groupMembers?: Array<{ name: string; role?: string; email?: string }>
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Use admin client to bypass RLS since we're using Clerk for auth
  // The user_id is validated via Clerk auth check above
  let supabase;
  try {
    supabase = createAdminClient();
    console.log("Admin client created successfully");
  } catch (error) {
    console.error("Failed to create admin client:", error);
    throw new Error(
      "Server configuration error. Please check SUPABASE_SERVICE_ROLE_KEY environment variable."
    );
  }

  try {
    console.log("Starting createProfile with:", {
      userId,
      profileData: JSON.stringify(profileData, null, 2),
      groupMembersCount: groupMembers?.length || 0,
    });

    // Ensure user exists in Supabase users table (required for foreign key constraint)
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("User not found");
    }

    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    console.log("Clerk user data:", {
      userId,
      email: userEmail,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    });
    
    // Try to ensure user exists in Supabase users table (required for foreign key constraint)
    // If the users table doesn't exist or has RLS issues, we'll try to create the user anyway
    // and handle errors gracefully
    if (userEmail) {
      try {
        // Try to insert the user (will fail silently if user already exists due to unique constraint)
        const { error: userError } = await supabase
          .from("users")
          .insert({
            id: userId,
            email: userEmail,
            first_name: clerkUser.firstName || null,
            last_name: clerkUser.lastName || null,
          })
          .select()
          .single();

        if (userError) {
          // Check if it's a unique constraint violation (user already exists)
          if (userError.code === "23505" || userError.message.includes("duplicate") || userError.message.includes("unique")) {
            console.log("User already exists in database, continuing...");
          } else {
            // Log other errors but don't fail - the profile insert might still work
            // if the foreign key constraint is not enforced or user exists
            console.warn("Warning: Could not create/verify user record:", {
              message: userError.message,
              details: userError.details,
              code: userError.code,
            });
            console.warn("Attempting to create profile anyway...");
          }
        } else {
          console.log("User record created/verified successfully");
        }
      } catch (error) {
        // If users table doesn't exist or has issues, log and continue
        console.warn("Warning: Could not access users table:", error);
        console.warn("Attempting to create profile anyway...");
      }
    } else {
      console.warn("Warning: No email found for user, profile creation may fail if foreign key constraint is enforced");
    }

    // Prepare the insert data
    const insertData = {
      user_id: userId,
      name: profileData.name,
      type: profileData.type,
      relationship_type: profileData.relationship_type,
      tone_preferences: profileData.tone_preferences,
      notes: profileData.notes || null,
    };

    console.log("Attempting to insert profile:", JSON.stringify(insertData, null, 2));

    // Insert the profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert(insertData)
      .select()
      .single();

    if (profileError) {
      console.error("Supabase profile insert error:", {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code,
        insertData: JSON.stringify(insertData, null, 2),
      });
      
      // Provide more detailed error message
      let errorMessage = profileError.message;
      if (profileError.details) {
        errorMessage += `: ${profileError.details}`;
      }
      if (profileError.hint) {
        errorMessage += ` (${profileError.hint})`;
      }
      
      throw new Error(`Failed to create profile: ${errorMessage}`);
    }

    console.log("Profile created successfully:", profile);

    // If there are group members, insert them into profile_members table
    if (groupMembers && groupMembers.length > 0 && profile) {
      const membersToInsert = groupMembers.map((member) => ({
        profile_id: profile.id,
        name: member.name,
        role: member.role || null,
        email: member.email || null,
      }));

      const { error: membersError } = await supabase
        .from("profile_members")
        .insert(membersToInsert);

      if (membersError) {
        console.error("Error creating profile members:", membersError);
        throw new Error(
          `Profile created but failed to add members: ${membersError.message}`
        );
      }
    }

    // Revalidate the profiles page to show the new profile
    revalidatePath("/dashboard/profiles");

    return {
      success: true,
      message: "Profile created successfully",
      profile,
    };
  } catch (error) {
    console.error("Error in createProfile:", error);
    
    // If it's already an Error with a message, re-throw it
    if (error instanceof Error) {
      throw error;
    }
    
    // Otherwise, wrap it in an Error
    throw new Error(
      `Failed to create profile: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export interface ProfileWithMembers extends Profile {
  members?: ProfileMember[];
}

export async function getProfiles(): Promise<ProfileWithMembers[]> {
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
    // Fetch profiles for the current user
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Fetch members for all profiles (if any are groups)
    const profileIds = profiles.map((p) => p.id);
    const { data: members, error: membersError } = await supabase
      .from("profile_members")
      .select("*")
      .in("profile_id", profileIds)
      .order("created_at", { ascending: true });

    if (membersError) {
      console.warn("Error fetching profile members:", membersError);
      // Don't fail if members can't be fetched, just continue without them
    }

    // Map members to their profiles
    const profilesWithMembers: ProfileWithMembers[] = profiles.map((profile) => {
      const profileMembers =
        members?.filter((m) => m.profile_id === profile.id) || [];
      return {
        ...profile,
        members: profileMembers,
      };
    });

    return profilesWithMembers;
  } catch (error) {
    console.error("Error in getProfiles:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Failed to fetch profiles: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getProfileCount(): Promise<number> {
  const { userId } = await auth();

  if (!userId) {
    return 0;
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("Failed to create admin client:", error);
    return 0;
  }

  try {
    const { count, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Error fetching profile count:", countError);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getProfileCount:", error);
    return 0;
  }
}

