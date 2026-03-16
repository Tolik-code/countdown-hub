import { Header } from "@/components/header";
import type { Metadata } from "next";
import { getServerDictionary, t } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dictionary: d } = await getServerDictionary();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const title = t(d, "privacy.metaTitle");
  const description = t(d, "privacy.metaDescription");
  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `${appUrl}/privacy` },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `${appUrl}/privacy` },
  };
}

function getArray(d: Record<string, unknown>, path: string): string[] {
  const keys = path.split(".");
  let val: unknown = d;
  for (const k of keys) {
    if (val && typeof val === "object" && k in val) {
      val = (val as Record<string, unknown>)[k];
    } else return [];
  }
  return Array.isArray(val) ? (val as string[]) : [];
}

export default async function PrivacyPage() {
  const { dictionary: d } = await getServerDictionary();

  return (
    <div className="min-h-screen">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-16 prose prose-neutral dark:prose-invert">
        <h1>{t(d, "privacy.title")}</h1>
        <p className="text-muted-foreground">{t(d, "privacy.lastUpdated")}</p>

        <h2>{t(d, "privacy.s1Title")}</h2>
        <p>{t(d, "privacy.s1Content")}</p>

        <h2>{t(d, "privacy.s2Title")}</h2>
        <p>{t(d, "privacy.s2Intro")}</p>
        <ul>
          {getArray(d, "privacy.s2Items").map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2>{t(d, "privacy.s3Title")}</h2>
        <p>{t(d, "privacy.s3Content")}</p>

        <h2>{t(d, "privacy.s4Title")}</h2>
        <p>{t(d, "privacy.s4Content")}</p>

        <h2>{t(d, "privacy.s5Title")}</h2>
        <p>{t(d, "privacy.s5Intro")}</p>
        <ul>
          {getArray(d, "privacy.s5Items").map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>

        <h2>{t(d, "privacy.s6Title")}</h2>
        <p>{t(d, "privacy.s6Content")}</p>

        <h2>{t(d, "privacy.s7Title")}</h2>
        <p>{t(d, "privacy.s7Content")}</p>

        <h2>{t(d, "privacy.s8Title")}</h2>
        <p>{t(d, "privacy.s8Content")}</p>
      </article>
    </div>
  );
}
