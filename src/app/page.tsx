import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Palette, Share2, Code, Globe, Sparkles } from "lucide-react";
import { AdBanner } from "@/components/ad-banner";

const features = [
  {
    icon: Clock,
    title: "Real-Time Countdowns",
    description:
      "Create precise countdown timers that tick in real-time down to the second.",
  },
  {
    icon: Palette,
    title: "Full Design Control",
    description:
      "Customize colors, fonts, backgrounds, and add custom CSS for pixel-perfect designs.",
  },
  {
    icon: Share2,
    title: "Share Anywhere",
    description:
      "Each countdown gets a unique public URL with rich social media previews.",
  },
  {
    icon: Code,
    title: "Embeddable",
    description:
      "Embed your countdown on any website with a simple iframe snippet.",
  },
  {
    icon: Globe,
    title: "Public Pages",
    description:
      "Beautiful standalone pages for each countdown, optimized for all devices.",
  },
  {
    icon: Sparkles,
    title: "OG Image Generation",
    description:
      "Dynamic social preview images that show your countdown's current state.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Countdown to What
          <br />
          <span className="text-primary/70">Matters Most</span>
        </h1>
        <p className="mb-8 max-w-xl text-lg text-muted-foreground">
          Create beautiful, customizable countdown timer pages. Share them with a
          link or embed them on your website. Fully free.
        </p>
        <div className="flex gap-3">
          {userId ? (
            <Button asChild size="lg">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/sign-up">Start for Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
          Everything you need
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="pt-6">
                <feature.icon className="mb-3 size-8 text-primary/70" />
                <h3 className="mb-1 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ad Banner */}
      <div className="mx-auto max-w-4xl px-4 py-4">
        <AdBanner slot="HOME_TOP" format="horizontal" className="min-h-[90px]" />
      </div>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold">Ready to start counting?</h2>
        <p className="mb-6 text-muted-foreground">
          Create your first countdown in under a minute.
        </p>
        <Button asChild size="lg">
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-4">
          <p>CountdownHub &copy; {new Date().getFullYear()}</p>
          <span className="text-muted-foreground/40">·</span>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
