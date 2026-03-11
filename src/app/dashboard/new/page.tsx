import Link from "next/link";
import { CountdownForm } from "@/components/countdown-form";
import { ArrowLeft } from "lucide-react";

export default function NewCountdownPage() {
  return (
    <div>
      <div className="mb-4 sm:mb-6 flex items-center gap-3">
        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md border p-2 hover:bg-muted transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">Create Countdown</h1>
      </div>
      <CountdownForm />
    </div>
  );
}
