import { Card } from "@/components/ui/card";
import { TodayUsageStats } from "@/app/actions/dashboard";

interface TodayUsageStatsProps {
  stats: TodayUsageStats;
}

export function TodayUsageStatsComponent({ stats }: TodayUsageStatsProps) {
  return (
    <Card className="rounded-xl border-border bg-card/80 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium tracking-tight text-foreground">
            Today&apos;s usage
          </h4>
          <p className="text-sm text-muted-foreground">
            How ReplyM8 is helping you right now.
          </p>
        </div>
        <span className="text-[0.8125rem] text-muted-foreground">Updated just now</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="text-sm text-muted-foreground">Replies</div>
          <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
            {stats.repliesCount}
          </div>
          {stats.repliesCountVsAvg !== null && (
            <div
              className={`text-[0.8125rem] mt-0.5 ${
                stats.repliesCountVsAvg >= 0 ? "text-emerald-400" : "text-muted-foreground"
              }`}
            >
              {stats.repliesCountVsAvg >= 0 ? "+" : ""}
              {stats.repliesCountVsAvg} vs avg
            </div>
          )}
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="text-sm text-muted-foreground">Profiles used</div>
          <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
            {stats.profilesUsed}
          </div>
          <div className="text-[0.8125rem] text-muted-foreground mt-0.5">
            Out of {stats.totalProfiles} total
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="text-sm text-muted-foreground">Avg length</div>
          <div className="text-2xl font-semibold tracking-tight text-foreground mt-1">
            {stats.averageLength}
          </div>
          <div className="text-[0.8125rem] text-muted-foreground mt-0.5">
            {stats.averageWordCount} words
          </div>
        </div>
      </div>
    </Card>
  );
}

