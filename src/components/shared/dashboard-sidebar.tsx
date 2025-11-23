"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Folder,
  MessageSquare,
  Sparkles,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/profiles", label: "Profiles", icon: Folder },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/dashboard/generator", label: "Generator", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-52 xl:w-60 border-b lg:border-b-0 lg:border-r border-slate-900 bg-slate-950/95">
      <div className="flex items-center justify-between lg:justify-start gap-2 p-4 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
            <span className="text-sm font-semibold tracking-tight">R8</span>
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-sm font-medium tracking-tight text-slate-50">
              ReplyM8
            </span>
            <span className="text-[0.8125rem] text-slate-400">Dashboard</span>
          </div>
        </div>
        <button className="inline-flex lg:hidden items-center rounded-lg border border-slate-800 bg-slate-900 text-[0.8125rem] text-slate-200 px-2 py-1">
          Menu
        </button>
      </div>

      <nav className="p-2 space-y-1 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-slate-900 text-slate-50"
                  : "text-slate-200 hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    isActive ? "text-slate-200" : "text-slate-300"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.href === "/dashboard" && (
                <span className="text-[0.75rem] text-slate-400">Today</span>
              )}
              {item.href === "/dashboard/profiles" && (
                <span className="text-[0.75rem] text-slate-400">12</span>
              )}
              {item.href === "/dashboard/conversations" && (
                <span className="text-[0.75rem] text-slate-400">+ Upload</span>
              )}
              {item.href === "/dashboard/generator" && (
                <span className="text-[0.75rem] text-slate-400">Active</span>
              )}
              {item.href === "/dashboard/settings" && (
                <span className="text-[0.75rem] text-slate-400">Plan</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-3 border-t border-slate-900 text-sm space-y-2">
        <div className="flex items-center justify-between text-slate-300">
          <span>Daily credits</span>
          <span>38 / 50</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-sky-500 to-emerald-400" />
        </div>
        <Button
          variant="outline"
          className="w-full mt-2 inline-flex items-center justify-center gap-1 rounded-lg border-slate-800 bg-slate-950 text-sm text-slate-100 px-2.5 py-1.5 hover:border-slate-600 hover:bg-slate-900 h-auto"
        >
          Upgrade plan
        </Button>
      </div>
    </aside>
  );
}

