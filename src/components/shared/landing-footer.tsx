import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-[0.75rem] text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-card border border-border flex items-center justify-center">
            <span className="text-[0.65rem] font-semibold tracking-tight text-foreground">R8</span>
          </div>
          <span>ReplyM8 · smarter, personal replies.</span>
        </div>
        <div className="flex flex-wrap gap-3 sm:items-center">
          <a href="#features" className="hover:text-foreground transition-colors">
            Product
          </a>
          <a href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </a>
          <Button
            variant="outline"
            className="inline-flex items-center gap-1 rounded-full border-border bg-card px-2.5 py-1 text-foreground hover:border-sky-500/70 hover:text-sky-300 h-auto text-[0.75rem]"
          >
            Join waitlist
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </footer>
  );
}

