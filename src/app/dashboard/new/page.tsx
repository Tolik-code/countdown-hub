import Link from "next/link";
import { CountdownForm } from "@/components/countdown-form";
import { ArrowLeft } from "lucide-react";
import { getCountdownPublicById } from "@/lib/actions";
import { getServerDictionary, t } from "@/lib/i18n/server";

export default async function NewCountdownPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template: templateId } = await searchParams;
  const template = templateId ? await getCountdownPublicById(templateId) : null;
  const { dictionary: d } = await getServerDictionary();

  return (
    <div>
      <div className="mb-4 sm:mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md border p-2 hover:bg-muted transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">{t(d, "form.createTitle")}</h1>
      </div>
      <CountdownForm template={template ?? undefined} />
    </div>
  );
}
