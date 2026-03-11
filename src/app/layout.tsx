import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "CountdownHub",
  description: "Create and share custom countdown timers",
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
