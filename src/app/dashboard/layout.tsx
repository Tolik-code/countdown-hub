import { UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getServerDictionary, t } from "@/lib/i18n/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dictionary: d } = await getServerDictionary();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-lg sm:text-xl font-bold">
            CountdownHub
          </Link>
          <div className="flex items-center gap-1 sm:gap-3">
            <LanguageSwitcher />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/explore">{t(d, "common.explore")}</Link>
            </Button>
            <Button asChild size="sm" className="px-2 sm:px-3">
              <Link href="/dashboard/new">
                <Plus className="size-4" />
                <span className="hidden sm:inline">{t(d, "common.newCountdown")}</span>
                <span className="sm:hidden">{t(d, "common.new")}</span>
              </Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
