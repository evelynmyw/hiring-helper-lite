import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { Button } from "@/components/ui/button";
import { searchCandidates } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Candidate Search — Recruiting Assistant" },
      {
        name: "description",
        content:
          "Ask natural-language recruiting questions and get sourced candidate matches from your resume database.",
      },
      { property: "og:title", content: "Candidate Search — Recruiting Assistant" },
      {
        property: "og:description",
        content: "Natural-language candidate sourcing over your resume database.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { id: number; role: "user" | "assistant" | "error"; content: string };

const SUGGESTIONS = [
  "Find a quantitative analyst who knows Python and machine learning",
  "Any candidates with a master's degree in a technical field?",
  "Looking for a senior corporate lawyer with 10+ years of M&A experience",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  async function send(query: string) {
    const text = query.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { id: Date.now(), role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await searchCandidates(text);
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, role: "assistant", content: res.answer },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "error",
          content: "Something went wrong, please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col px-4">
      <div className="flex-1 space-y-4 overflow-y-auto py-6">
        {messages.length === 0 && (
          <div className="mt-10 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Candidate search
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Describe the person you're looking for in plain English. The assistant
              searches the resume database and explains its picks.
            </p>
            <div className="mx-auto mt-6 flex max-w-xl flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                m.role === "user" && "bg-primary text-primary-foreground",
                m.role === "assistant" && "border border-border bg-card",
                m.role === "error" &&
                  "border border-destructive/30 bg-destructive/10 text-destructive",
              )}
            >
              {m.role === "assistant" ? (
                <Markdown>{m.content}</Markdown>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {m.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
              <span className="flex gap-1">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </span>
              <span className="text-xs text-muted-foreground">
                Searching candidates…
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="sticky bottom-0 bg-background pb-6 pt-2"
      >
        <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 shadow-sm focus-within:border-primary/50">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Find a quantitative analyst who knows Python and machine learning"
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
