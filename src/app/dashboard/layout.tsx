import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-lg sm:text-xl font-bold">
            CountdownHub
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild size="sm">
              <Link href="/dashboard/new">
                <Plus className="size-4" />
                <span className="hidden sm:inline">New Countdown</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
