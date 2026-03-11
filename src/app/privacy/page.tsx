import { Header } from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - CountdownHub",
  description: "CountdownHub privacy policy. Learn how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-16 prose prose-neutral dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: March 11, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>
          When you create an account on CountdownHub, we collect your email address
          and basic profile information through our authentication provider (Clerk).
          When you create countdowns, we store the content you provide including titles,
          descriptions, dates, and uploaded images.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and maintain the CountdownHub service</li>
          <li>Authenticate your account and manage your countdowns</li>
          <li>Display your public countdown pages to visitors</li>
          <li>Generate social media preview images for shared countdowns</li>
        </ul>

        <h2>3. Data Storage</h2>
        <p>
          Your data is stored securely using Supabase (PostgreSQL database and file storage).
          Uploaded images are stored in Supabase Storage. We do not sell or share your
          personal data with third parties.
        </p>

        <h2>4. Public Countdowns</h2>
        <p>
          Countdowns you create are accessible via their public URL. Anyone with the
          link can view the countdown page. Search engines may index public countdown
          pages. You can delete your countdowns at any time from your dashboard.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Clerk</strong> — Authentication and user management</li>
          <li><strong>Supabase</strong> — Database and file storage</li>
          <li><strong>Vercel</strong> — Hosting and deployment</li>
          <li><strong>Google Gemini API</strong> — AI-powered event date lookup (queries are not stored)</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management.
          We do not use tracking or advertising cookies.
        </p>

        <h2>7. Data Deletion</h2>
        <p>
          You can delete your countdowns and associated data at any time from your
          dashboard. To delete your account entirely, please contact us.
        </p>

        <h2>8. Contact</h2>
        <p>
          If you have questions about this privacy policy, please reach out via
          the contact information on our website.
        </p>
      </article>
    </div>
  );
}
