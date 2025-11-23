import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";

export default function ConversationsPage() {
  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-foreground">
            Conversations
          </h3>
          <p className="text-sm sm:text-sm text-muted-foreground">
            Upload and manage conversation threads to enrich profiles.
          </p>
        </div>
        <Button className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 text-white dark:text-slate-950 text-sm font-medium tracking-tight px-3 py-1.5 hover:bg-sky-400 h-auto">
          <Upload className="h-3.5 w-3.5" />
          Upload Thread
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-4 space-y-3 overflow-y-auto pt-4">
        {/* Upload area */}
        <Card className="rounded-xl border-dashed border-border bg-card/60 p-6 sm:p-8 space-y-3 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-sky-500/10 border border-sky-500/40 flex items-center justify-center">
              <Upload className="h-6 w-6 text-sky-400" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Upload conversation threads
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Drop screenshots, text files, or paste conversation history
            </p>
          </div>
          <Button
            variant="outline"
            className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-4 py-2 hover:bg-muted"
          >
            <Upload className="h-4 w-4" />
            Browse files
          </Button>
        </Card>

        {/* Conversation list */}
        <div className="space-y-2">
          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-medium text-foreground">
                  Quarterly roadmap check-in
                </h4>
                <span className="text-[0.8125rem] text-muted-foreground whitespace-nowrap">
                  Email · 12 msgs
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                You shared a risk summary and updated timelines. Lena asked to
                emphasize tradeoffs and customer impact more clearly.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[0.8125rem] text-muted-foreground/70">
                  Linked to:
                </span>
                <span className="text-[0.8125rem] text-foreground">
                  Lena · Product Lead
                </span>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-medium text-foreground">
                  Launch retro notes
                </h4>
                <span className="text-[0.8125rem] text-muted-foreground whitespace-nowrap">
                  DM · 6 msgs
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                Quick Slack thread summarizing what went well and what to change
                for the next launch.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[0.8125rem] text-muted-foreground/70">
                  Linked to:
                </span>
                <span className="text-[0.8125rem] text-foreground">
                  ACME · Exec team
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
