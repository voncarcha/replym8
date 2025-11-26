"use client";

import { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useThemeStore } from "@/lib/store";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        theme: theme === "dark" ? dark : undefined,
      }}
    >
      {children}
      <Toaster position="bottom-right" richColors />
    </ClerkProvider>
  );
}

