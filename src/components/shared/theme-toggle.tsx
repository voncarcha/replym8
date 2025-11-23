"use client";

import { Moon, Sun } from "lucide-react";
import { startTransition, useEffect, useState, useCallback } from "react";
import { useThemeStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    // Get the current theme from the store to ensure we always have the latest value
    const currentTheme = useThemeStore.getState().theme;
    
    if (currentTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [setTheme]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}

