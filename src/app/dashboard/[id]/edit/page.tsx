import { notFound } from "next/navigation";
import Link from "next/link";
import { getCountdownById } from "@/lib/actions";
import { CountdownForm } from "@/components/countdown-form";
import { ArrowLeft } from "lucide-react";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCountdownPage({ params }: EditPageProps) {
  const { id } = await params;
  const countdown = await getCountdownById(id);

  if (!countdown) {
    notFound();
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md border p-2 hover:bg-muted transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">Edit Countdown</h1>
      </div>
      <CountdownForm countdown={countdown} />
    </div>
  );
}
