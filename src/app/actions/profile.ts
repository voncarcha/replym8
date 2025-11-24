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

export async function getProfileById(profileId: string): Promise<ProfileWithMembers | null> {
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
    // Fetch the profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .eq("user_id", userId)
      .single();

    if (profileError) {
      // PGRST116 means no rows returned (profile not found)
      // This is expected when a profile has been deleted or doesn't exist
      if (profileError.code === "PGRST116") {
        return null;
      }
      // Only log unexpected errors with meaningful information
      if (profileError.message || profileError.code) {
        console.error("Error fetching profile:", profileError);
        throw new Error(`Failed to fetch profile: ${profileError.message || profileError.code}`);
      }
      // If error object is empty or malformed, just return null
      return null;
    }

    if (!profile) {
      return null;
    }

    // Fetch members if it's a group profile
    const { data: members, error: membersError } = await supabase
      .from("profile_members")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true });

    if (membersError) {
      console.warn("Error fetching profile members:", membersError);
      // Don't fail if members can't be fetched, just continue without them
    }

    return {
      ...profile,
      members: members || [],
    };
  } catch (error) {
    console.error("Error in getProfileById:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      `Failed to fetch profile: ${error instanceof Error ? error.message : String(error)}`
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

export async function updateProfile(
  profileId: string,
  profileData: CreateProfileInput,
  groupMembers?: Array<{ name: string; role?: string; email?: string }>
): Promise<{ success: boolean; message: string }> {
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
    // First, verify the profile belongs to the user
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_id")
      .eq("id", profileId)
      .eq("user_id", userId)
      .single();

    if (profileError || !existingProfile) {
      throw new Error("Profile not found or unauthorized");
    }

    // Prepare the update data
    const updateData = {
      name: profileData.name,
      type: profileData.type,
      relationship_type: profileData.relationship_type,
      tone_preferences: profileData.tone_preferences,
      notes: profileData.notes || null,
      updated_at: new Date().toISOString(),
    };

    // Update the profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", profileId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }

    // Handle group members if provided
    if (groupMembers && groupMembers.length > 0) {
      // Delete existing members
      const { error: deleteMembersError } = await supabase
        .from("profile_members")
        .delete()
        .eq("profile_id", profileId);

      if (deleteMembersError) {
        console.warn("Error deleting existing profile members:", deleteMembersError);
      }

      // Insert new members
      const membersToInsert = groupMembers.map((member) => ({
        profile_id: profileId,
        name: member.name,
        role: member.role || null,
        email: member.email || null,
      }));

      const { error: insertMembersError } = await supabase
        .from("profile_members")
        .insert(membersToInsert);

      if (insertMembersError) {
        console.error("Error inserting profile members:", insertMembersError);
        throw new Error(`Failed to update profile members: ${insertMembersError.message}`);
      }
    } else if (profileData.type === "individual") {
      // If switching to individual or no members provided, delete all members
      const { error: deleteMembersError } = await supabase
        .from("profile_members")
        .delete()
        .eq("profile_id", profileId);

      if (deleteMembersError) {
        console.warn("Error deleting profile members:", deleteMembersError);
      }
    }

    // Revalidate the profiles pages
    revalidatePath("/dashboard/profiles", "page");
    revalidatePath(`/dashboard/profiles/${profileId}`, "page");

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update profile");
  }
}

export async function deleteProfile(profileId: string): Promise<{ success: boolean; message: string }> {
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
    // First, verify the profile belongs to the user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_id")
      .eq("id", profileId)
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("Profile not found or unauthorized");
    }

    // Delete profile members first (due to foreign key constraint)
    const { error: membersError } = await supabase
      .from("profile_members")
      .delete()
      .eq("profile_id", profileId);

    if (membersError) {
      console.warn("Error deleting profile members:", membersError);
      // Continue with profile deletion even if members deletion fails
    }

    // Delete the profile
    const { error: deleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", profileId)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Error deleting profile:", deleteError);
      throw new Error(`Failed to delete profile: ${deleteError.message}`);
    }

    // Revalidate the profiles list page only
    // Don't revalidate the detail page to avoid errors
    revalidatePath("/dashboard/profiles", "page");

    return {
      success: true,
      message: "Profile deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteProfile:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete profile");
  }
}

