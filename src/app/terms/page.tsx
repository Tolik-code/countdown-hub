import { Header } from "@/components/header";
import type { Metadata } from "next";
import { getServerDictionary, t } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dictionary: d } = await getServerDictionary();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const title = t(d, "terms.metaTitle");
  const description = t(d, "terms.metaDescription");
  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `${appUrl}/terms` },
    twitter: { card: "summary", title, description },
    alternates: { canonical: `${appUrl}/terms` },
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

export default async function TermsPage() {
  const { dictionary: d } = await getServerDictionary();

  return (
    <div className="min-h-screen">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-16 prose prose-neutral dark:prose-invert">
        <h1>{t(d, "terms.title")}</h1>
        <p className="text-muted-foreground">{t(d, "terms.lastUpdated")}</p>

        <h2>{t(d, "terms.s1Title")}</h2>
        <p>{t(d, "terms.s1Content")}</p>

        <h2>{t(d, "terms.s2Title")}</h2>
        <p>{t(d, "terms.s2Content")}</p>

        <h2>{t(d, "terms.s3Title")}</h2>
        <p>{t(d, "terms.s3Content")}</p>

        <h2>{t(d, "terms.s4Title")}</h2>
        <p>{t(d, "terms.s4Content")}</p>
        <p>{t(d, "terms.s4Intro")}</p>
        <ul>
          {getArray(d, "terms.s4Items").map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2>{t(d, "terms.s5Title")}</h2>
        <p>{t(d, "terms.s5Intro")}</p>
        <ul>
          {getArray(d, "terms.s5Items").map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2>{t(d, "terms.s6Title")}</h2>
        <p>{t(d, "terms.s6Content")}</p>

        <h2>{t(d, "terms.s7Title")}</h2>
        <p>{t(d, "terms.s7Content")}</p>

        <h2>{t(d, "terms.s8Title")}</h2>
        <p>{t(d, "terms.s8Content")}</p>

        <h2>{t(d, "terms.s9Title")}</h2>
        <p>{t(d, "terms.s9Content")}</p>
      </article>
    </div>
  );
}
