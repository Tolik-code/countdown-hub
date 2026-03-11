import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${fontVariables} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
