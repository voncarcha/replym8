"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

export async function updateProfileName(firstName: string, lastName: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  // Example: In a real app, you would update the user's profile in your database
  // For now, we'll just return the updated user info
  // This demonstrates how to use Clerk's auth in server actions

  return {
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress,
    },
  };
}

export async function getCurrentUserProfile() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress,
    imageUrl: user.imageUrl,
  };
}

