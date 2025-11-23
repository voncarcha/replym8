import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
  title: "Dashboard | ReplyM8",
  description: "Dashboard for ReplyM8",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
