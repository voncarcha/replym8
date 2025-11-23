import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Save, Upload } from "lucide-react";

export default function ProfileDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-border">
        <div>
          <h3 className="text-base sm:text-xl font-medium tracking-tight text-foreground">
            Profile details
          </h3>
          <p className="text-sm sm:text-sm text-muted-foreground">
            Edit how ReplyM8 understands this recipient.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="inline-flex items-center gap-1.5 rounded-lg border-border bg-card text-sm text-rose-300 px-3 py-1.5 hover:border-rose-500/80 hover:bg-rose-500/10 h-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete profile
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-4 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] overflow-y-auto pt-4">
        {/* Left: fields */}
        <div className="space-y-3">
          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                LP
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground">Name</label>
                <input
                  className="mt-1 w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  defaultValue="Lena · Product Lead"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">Relationship</label>
                <select className="mt-1 w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500">
                  <option>Boss</option>
                  <option>Client</option>
                  <option>Friend</option>
                  <option>Lead</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Preferred channel</label>
                <select className="mt-1 w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500">
                  <option>Email</option>
                  <option>Slack</option>
                  <option>SMS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Communication style</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 min-h-16 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Describe tone, length, preferences."
                defaultValue="Formal but concise. Values clear tradeoffs, avoids fluff. No emojis. Respond within 24h during weekdays."
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Notes</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-border bg-background text-sm text-foreground px-2.5 py-1.5 min-h-14 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Anything you want ReplyM8 to remember."
                defaultValue="Often juggling exec reviews—help her look prepared and concise."
              />
            </div>

            <Button
              variant="outline"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border-border bg-card text-sm text-foreground px-3 py-1.5 hover:border-sky-500/70 hover:bg-muted h-auto"
            >
              <Save className="h-3.5 w-3.5" />
              Regenerate profile summary
            </Button>
          </Card>
        </div>

        {/* Right: past conversations */}
        <div className="space-y-3">
          <Card className="rounded-xl border-border bg-card/80 p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium tracking-tight text-foreground">
                Past conversations
              </h4>
              <Button
                variant="outline"
                className="inline-flex items-center gap-1 rounded-lg border-border bg-card text-sm text-foreground px-2.5 py-1.5 hover:bg-muted h-auto"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload thread
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-background/80 p-3 text-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Quarterly roadmap check-in</span>
                <span className="text-[0.75rem] text-muted-foreground">Email · 12 msgs</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                You shared a risk summary and updated timelines. Lena asked to emphasize tradeoffs
                and customer impact more clearly.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background/80 p-3 text-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Launch retro notes</span>
                <span className="text-[0.75rem] text-muted-foreground">DM · 6 msgs</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Quick Slack thread summarizing what went well and what to change for the next
                launch.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

