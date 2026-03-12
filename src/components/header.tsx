import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getServerDictionary, t } from "@/lib/i18n/server";

export async function Header() {
  const { userId } = await auth();
  const { dictionary: d } = await getServerDictionary();

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold">
          <Image src="/logo.png" alt="CountdownHub" width={36} height={36} className="rounded-lg" />
          <span className="hidden sm:inline">CountdownHub</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3 shrink-0">
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="sm" className="px-2 sm:px-3">
            <Link href="/explore">{t(d, "common.explore")}</Link>
          </Button>
          {userId ? (
            <Button asChild variant="default" size="sm" className="px-2 sm:px-3">
              <Link href="/dashboard">{t(d, "common.dashboard")}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/sign-in">{t(d, "common.signIn")}</Link>
              </Button>
              <Button asChild size="sm" className="px-2 sm:px-3">
                <Link href="/sign-up">{t(d, "common.signUp")}</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
