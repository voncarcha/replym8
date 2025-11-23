import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

export async function AuthGuard({
  children,
  fallbackUrl = "/sign-in",
}: AuthGuardProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect(fallbackUrl);
  }

  return <>{children}</>;
}

