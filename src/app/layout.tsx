import type { Metadata } from "next";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { fontVariables } from "@/lib/fonts";
import { getLocaleFromCookies } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import "./globals.css";

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

export const metadata: Metadata = {
  title: {
    default: "CountdownHub — Create & Share Custom Countdown Timers",
    template: "%s | CountdownHub",
  },
  description:
    "Create beautiful, customizable countdown timer pages for free. Share them with a link, embed on your website. Track events, holidays, launches, and more with real-time countdowns.",
  keywords: [
    "countdown timer",
    "countdown creator",
    "event countdown",
    "online timer",
    "countdown page",
    "embeddable countdown",
    "free countdown timer",
    "custom countdown",
    "share countdown",
    "countdown widget",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    siteName: "CountdownHub",
    title: "CountdownHub — Create & Share Custom Countdown Timers",
    description:
      "Create beautiful, customizable countdown timer pages for free. Share them with a link or embed on your website.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CountdownHub — Create & Share Custom Countdown Timers",
    description:
      "Create beautiful, customizable countdown timer pages for free.",
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(process.env.NEXT_PUBLIC_ADSENSE_ID
    ? {
        other: {
          "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_ID,
        },
      }
    : {}),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookies();
  const dictionary = getDictionary(locale);

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body className={`${fontVariables} font-sans antialiased`}>
          <LocaleProvider locale={locale} dictionary={dictionary}>
            {children}
          </LocaleProvider>
          {adsenseId && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}
          <Script
            src="https://pl28902764.effectivegatecpm.com/d8/c0/9a/d8c09a2f2f645f6c23ad3b32915cb19c.js"
            strategy="afterInteractive"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
