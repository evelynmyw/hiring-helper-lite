import { ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function BackButton({ to }: { to?: string }) {
  const className =
    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

  if (to) {
    return (
      <Link to={to} className={className}>
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className={className}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </button>
  );
}
