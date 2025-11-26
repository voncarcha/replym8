"use client";

import { cn } from "@/lib/utils";

type Mode = "reply" | "compose";

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="inline-flex items-center gap-2 text-[0.7rem] text-muted-foreground">
      <span>Mode</span>
      <div className="inline-flex items-center rounded-full border border-border bg-card overflow-hidden">
        <button
          onClick={() => onModeChange("reply")}
          className={cn(
            "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
            mode === "reply"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          Reply
        </button>
        <button
          onClick={() => onModeChange("compose")}
          className={cn(
            "px-2 py-1 text-[0.7rem] font-medium transition-colors cursor-pointer",
            mode === "compose"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          Compose
        </button>
      </div>
    </div>
  );
}

