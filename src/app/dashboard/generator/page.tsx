"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, RefreshCw, Info } from "lucide-react";
import { useState } from "react";

export default function ReplyGeneratorPage() {
  const [message, setMessage] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("lena");

  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-foreground">
            Reply generator
          </h3>
          <p className="text-sm sm:text-sm text-muted-foreground">
            Paste a message, choose a profile, and fine-tune your reply.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-foreground">
          <span>Length</span>
          <div className="inline-flex items-center rounded-full border border-border bg-card overflow-hidden">
            <button className="px-2 py-1 text-sm bg-primary text-primary-foreground font-medium">
              Short
            </button>
            <button className="px-2 py-1 text-sm text-muted-foreground hover:bg-muted">
              Medium
            </button>
            <button className="px-2 py-1 text-sm text-muted-foreground hover:bg-muted">
              Long
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)] overflow-y-auto pt-4">
        {/* Left: input */}
        <div className="space-y-3">
          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Incoming message
              </label>
              <div className="inline-flex items-center gap-2 text-sm text-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5">
                  Email
                </span>
                <span className="rounded-full border border-border bg-card px-2 py-0.5">
                  Chat
                </span>
              </div>
            </div>
            <textarea
              className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-2 min-h-24 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Paste the message you need to reply to..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Tip: include a few lines of previous context for best results.
              </span>
              <span>{message.length} / 2,000 chars</span>
            </div>
          </Card>

          {/* Conversation upload drawer */}
          <Card className="rounded-xl border-dashed border-border bg-card/60 p-3 sm:p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <span>Drop screenshots or text threads</span>
              </div>
              <Button
                variant="outline"
                className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
              >
                Browse files
              </Button>
            </div>
            <div className="flex items-center justify-between text-[0.8125rem] text-muted-foreground">
              <span>OCR will extract context for this profile.</span>
              <div className="inline-flex items-center gap-1">
                <span className="text-foreground">Link to profile</span>
                <select className="rounded-md border border-border bg-background text-[0.8125rem] text-foreground px-1.5 py-0.5">
                  <option>Lena · Product Lead</option>
                  <option>ACME · Exec team</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: profile-select + output */}
        <div className="space-y-3">
          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Recipient profile
              </label>
              <Button
                variant="outline"
                className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
              >
                Manage profiles
              </Button>
            </div>
            <select
              className="w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
            >
              <option value="lena">Lena · Product Lead (Boss)</option>
              <option value="acme">ACME · Exec team (Client group)</option>
              <option value="alex">Alex · Friend</option>
            </select>
            <div className="flex flex-wrap gap-1.5 text-[0.8125rem] text-foreground">
              <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                Formal
              </span>
              <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                Short replies
              </span>
              <span className="rounded-full bg-background/80 border border-border px-2 py-0.5">
                No emojis
              </span>
            </div>
          </Card>

          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Generated reply
              </label>
              <div className="inline-flex items-center gap-1 text-sm text-foreground">
                <span>Tone</span>
                <select className="rounded-md border border-border bg-background text-sm text-foreground px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-sky-500">
                  <option>Match profile</option>
                  <option>Softer</option>
                  <option>More direct</option>
                </select>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background/80 p-3 min-h-28">
              <p className="text-sm text-foreground">
                {message
                  ? "Here's a concise update you can send Lena. It highlights the key risks, keeps the tone formal, and makes it easy for her to speak to tradeoffs in the review."
                  : "Generated reply will appear here after you paste a message..."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium px-2.5 py-1.5 hover:bg-primary/90 h-auto"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </Button>
              </div>
              <div className="inline-flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Ready to send
                </span>
                <button className="underline underline-offset-2 hover:text-foreground">
                  Improve opening
                </button>
              </div>
            </div>
          </Card>

          {/* Small insight footer */}
          <Card className="rounded-xl border-border bg-card/70 p-3 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 text-sky-400 shrink-0" />
            <p>
              ReplyM8 keeps this reply aligned with Lena&apos;s profile and
              similar past threads. You can still tweak tone or length before
              copying.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
