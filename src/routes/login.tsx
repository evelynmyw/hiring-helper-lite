import { createFileRoute } from "@tanstack/react-router";
import { AuthComponent } from "@/components/ui/sign-up";
import taraLogo from "@/assets/tara-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Tara" },
      {
        name: "description",
        content: "Sign in to the recruiting assistant to search candidates and screen resumes.",
      },
      { property: "og:title", content: "Sign in — Tara" },
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
      <AuthComponent brandName="Tara" />
    </main>
  );
}
