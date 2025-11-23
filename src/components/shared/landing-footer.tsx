import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-[0.75rem] text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
            <span className="text-[0.65rem] font-semibold tracking-tight text-slate-100">R8</span>
          </div>
          <span>ReplyM8 · smarter, personal replies.</span>
        </div>
        <div className="flex flex-wrap gap-3 sm:items-center">
          <a href="#features" className="hover:text-slate-200">
            Product
          </a>
          <a href="#pricing" className="hover:text-slate-200">
            Pricing
          </a>
          <Button
            variant="outline"
            className="inline-flex items-center gap-1 rounded-full border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-200 hover:border-sky-500/70 hover:text-sky-300 h-auto text-[0.75rem]"
          >
            Join waitlist
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </footer>
  );
}

