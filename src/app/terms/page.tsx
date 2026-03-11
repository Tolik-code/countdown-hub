import { Header } from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - CountdownHub",
  description: "CountdownHub terms of service. Read before using our platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-16 prose prose-neutral dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: March 11, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using CountdownHub, you agree to be bound by these Terms
          of Service. If you do not agree to these terms, do not use the service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          CountdownHub provides a free platform for creating, customizing, and sharing
          countdown timer pages. Users can create public countdown pages, embed them
          on other websites, and share them via unique URLs.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You must create an account to use CountdownHub. You are responsible for
          maintaining the security of your account and for all activities that occur
          under your account.
        </p>

        <h2>4. User Content</h2>
        <p>
          You retain ownership of all content you create on CountdownHub, including
          countdown titles, descriptions, and uploaded images. By creating public
          countdowns, you grant CountdownHub a license to display that content publicly.
        </p>
        <p>You agree not to upload content that:</p>
        <ul>
          <li>Violates any applicable laws or regulations</li>
          <li>Infringes on intellectual property rights of others</li>
          <li>Contains malicious code or scripts</li>
          <li>Is abusive, harassing, or harmful</li>
        </ul>

        <h2>5. Prohibited Uses</h2>
        <p>You may not:</p>
        <ul>
          <li>Use the service for any illegal purpose</li>
          <li>Attempt to bypass security measures or rate limits</li>
          <li>Upload harmful or malicious content</li>
          <li>Abuse the AI date lookup feature with injection attacks</li>
          <li>Use automated tools to create excessive countdowns</li>
        </ul>

        <h2>6. Service Availability</h2>
        <p>
          CountdownHub is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
          guarantee uninterrupted access to the service. We may modify or discontinue
          features at any time.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          CountdownHub shall not be liable for any indirect, incidental, or
          consequential damages arising from your use of the service.
        </p>

        <h2>8. Termination</h2>
        <p>
          We reserve the right to terminate or suspend accounts that violate these
          terms. You may delete your account and countdowns at any time.
        </p>

        <h2>9. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the service
          after changes constitutes acceptance of the new terms.
        </p>
      </article>
    </div>
  );
}
