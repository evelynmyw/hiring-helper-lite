import { createFileRoute } from "@tanstack/react-router";
import { AuthComponent } from "@/components/ui/sign-up";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Recruiting Assistant" },
      {
        name: "description",
        content: "Sign in to the recruiting assistant to search candidates and screen resumes.",
      },
      { property: "og:title", content: "Sign in — Recruiting Assistant" },
      {
        property: "og:description",
        content: "Sign in to the recruiting assistant to search candidates and screen resumes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <AuthComponent brandName="Recruiting Assistant" />
    </main>
  );
}
