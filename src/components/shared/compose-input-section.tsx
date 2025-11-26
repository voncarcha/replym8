"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Plus, FolderOpen, List } from "lucide-react";

interface ComposeInputSectionProps {
  composeTo: string;
  onComposeToChange: (value: string) => void;
  composeSubject: string;
  onComposeSubjectChange: (value: string) => void;
  composeMessage: string;
  onComposeMessageChange: (value: string) => void;
}

export function ComposeInputSection({
  composeTo,
  onComposeToChange,
  composeSubject,
  onComposeSubjectChange,
  composeMessage,
  onComposeMessageChange,
}: ComposeInputSectionProps) {
  return (
    <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">
            Compose new message
          </label>
          <span className="text-sm text-muted-foreground">
            Start from scratch with AI help.
          </span>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full border border-border bg-card px-2 py-0.5">
            Email
          </span>
          <span className="rounded-full border border-border bg-card px-2 py-0.5">
            DM
          </span>
        </div>
      </div>
      {/* To / Subject row */}
      <div className="space-y-2">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]">
          <div>
            <label className="block text-muted-foreground text-sm">
              To
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
              <input
                type="text"
                className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
                placeholder="lena@company.com or pick from profiles"
                value={composeTo}
                onChange={(e) => onComposeToChange(e.target.value)}
              />
              <button className="inline-flex items-center gap-1 rounded-md border border-border bg-card text-sm text-foreground px-1.5 py-0.5 hover:bg-muted transition-colors cursor-pointer">
                <FolderOpen className="h-3 w-3" />
                Profiles
              </button>
            </div>
          </div>
          <div>
            <label className="block text-muted-foreground text-sm">
              Subject
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Roadmap risks for tomorrow's exec review"
              value={composeSubject}
              onChange={(e) => onComposeSubjectChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Compose body with toolbar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Message body
          </span>
          <div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <button className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-0.5 hover:bg-muted transition-colors cursor-pointer">
              <List className="h-3 w-3" />
              Outline
            </button>
            <button className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-0.5 hover:bg-muted transition-colors cursor-pointer">
              <Plus className="h-3 w-3" />
              Add points
            </button>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card/80">
          {/* Tiny toolbar */}
          <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <button className="inline-flex items-center justify-center h-5 w-5 rounded border border-border bg-background hover:bg-muted transition-colors cursor-pointer">
                <span className="text-sm font-medium">B</span>
              </button>
              <button className="inline-flex items-center justify-center h-5 w-5 rounded border border-border bg-background hover:bg-muted transition-colors cursor-pointer">
                <span className="text-sm font-medium">I</span>
              </button>
              <button className="inline-flex items-center justify-center h-5 w-5 rounded border border-border bg-background hover:bg-muted transition-colors cursor-pointer">
                <span className="text-sm font-medium">•</span>
              </button>
            </div>
            <div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <List className="h-3 w-3" />
              <span>Plain</span>
            </div>
          </div>
          <textarea
            className="w-full rounded-b-lg bg-transparent text-sm text-foreground px-2.5 py-2 min-h-24 focus:outline-none focus:ring-0"
            placeholder="Draft what you want to say, or leave a rough idea and let ReplyM8 tighten it up."
            value={composeMessage}
            onChange={(e) => onComposeMessageChange(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Hint: describe intent (status update, ask, follow-up) for
            sharper drafts.
          </span>
          <span>{composeMessage.length} / 2,000 chars</span>
        </div>
      </div>
      {/* Compose actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5">
          <Button
            size="sm"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 hover:bg-primary/90 h-auto"
          >
            <Send className="h-3.5 w-3.5" />
            Generate message
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-3 py-1.5 hover:bg-muted h-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            Improve draft
          </Button>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Compose mode ready
          </span>
        </div>
      </div>
    </Card>
  );
}

