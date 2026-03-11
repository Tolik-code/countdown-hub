import { CountdownForm } from "@/components/countdown-form";

export default function NewCountdownPage() {
  return (
    <div>
      <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold">Create Countdown</h1>
      <CountdownForm />
    </div>
  );
}
