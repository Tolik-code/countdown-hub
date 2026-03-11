import { notFound } from "next/navigation";
import { getCountdownById } from "@/lib/actions";
import { CountdownForm } from "@/components/countdown-form";

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
      <h1 className="mb-6 text-2xl font-bold">Edit Countdown</h1>
      <CountdownForm countdown={countdown} />
    </div>
  );
}
