import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CountdownNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-2 text-4xl font-bold">Countdown Not Found</h1>
      <p className="mb-6 text-muted-foreground">
        This countdown doesn&apos;t exist or may have been deleted.
      </p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
