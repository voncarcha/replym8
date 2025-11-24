"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/utils/supabase/server";
import { CreateProfileInput } from "@/types";

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
      description: profileData.description || null,
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

