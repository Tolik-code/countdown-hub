import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Palette, Share2, Code, Globe, Sparkles } from "lucide-react";
import { AdBanner } from "@/components/ad-banner";
import { getServerDictionary, t } from "@/lib/i18n/server";

const featureKeys = [
  { icon: Clock, key: "realTime" },
  { icon: Palette, key: "design" },
  { icon: Share2, key: "share" },
  { icon: Code, key: "embed" },
  { icon: Globe, key: "public" },
  { icon: Sparkles, key: "og" },
] as const;

export default async function Home() {
  const { userId } = await auth();
  const { dictionary: d } = await getServerDictionary();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-32">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {t(d, "home.heroTitle1")}
          <br />
          <span className="text-primary/70">{t(d, "home.heroTitle2")}</span>
        </h1>
        <p className="mb-8 max-w-xl text-base sm:text-lg text-muted-foreground">
          {t(d, "home.heroDescription")}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {userId ? (
            <Button asChild size="lg">
              <Link href="/dashboard">{t(d, "common.goToDashboard")}</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/sign-up">{t(d, "common.startForFree")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-in">{t(d, "common.signIn")}</Link>
              </Button>
            </>
          )}
          <Button asChild variant="outline" size="lg">
            <Link href="/explore">{t(d, "common.exploreCountdowns")}</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
          {t(d, "home.featuresTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map(({ icon: Icon, key }) => (
            <Card key={key}>
              <CardContent className="pt-6">
                <Icon className="mb-3 size-8 text-primary/70" />
                <h3 className="mb-1 font-semibold">{t(d, `home.features.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground">
                  {t(d, `home.features.${key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ad Banner */}
      <div className="mx-auto max-w-4xl px-4 py-4">
        <AdBanner variant="horizontal" className="min-h-[90px]" />
      </div>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold">{t(d, "home.ctaTitle")}</h2>
        <p className="mb-6 text-muted-foreground">
          {t(d, "home.ctaDescription")}
        </p>
        <Button asChild size="lg">
          <Link href="/sign-up">{t(d, "common.getStarted")}</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-4">
          <p>{t(d, "common.copyright", { year: new Date().getFullYear() })}</p>
          <span className="text-muted-foreground/40">&middot;</span>
          <Link href="/privacy" className="hover:underline">{t(d, "common.privacy")}</Link>
          <Link href="/terms" className="hover:underline">{t(d, "common.terms")}</Link>
        </div>
      </footer>
    </div>
  );
}
