import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { chatComplete } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Shimmer } from "@/components/shimmer";
import { PageShell } from "@/components/page-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Productivity Assistant — Chat" },
      { name: "description", content: "Your friendly AI co-pilot for everyday work tasks." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const run = useServerFn(chatComplete);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { text: reply } = await run({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 9e6, behavior: "smooth" }), 50);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went sideways. Try again?");
    } finally {
      setLoading(false);
    }
  }

  const titleNode = (
    <div className="space-y-1">
      <span className="block text-3xl font-extrabold tracking-tight sm:text-4xl">
        Ready to make today feel lighter?
      </span>
      <span className="block text-lg font-medium text-primary sm:text-xl">
        Your work bestie is here. Let’s do this.
      </span>
    </div>
  );

  return (
    <PageShell
      title={titleNode}
      subtitle="Ask me anything work-related — drafting, planning, brainstorming, you name it."
    >
      <Card className="flex h-[calc(100vh-220px)] min-h-[420px] flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !loading && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="glow-pulse mb-5 inline-flex">
                  <Sparkles className="h-14 w-14 text-primary" />
                </div>
                <p className="text-base font-medium text-foreground">
                  No messages yet. Drop a prompt below to get started.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs sm:text-sm">
                  {[
                    { label: "Draft a follow-up email", icon: "✉️" },
                    { label: "Summarize my week", icon: "📊" },
                    { label: "Plan my Monday", icon: "🗓️" },
                  ].map(({ label, icon }) => (
                    <button
                      key={label}
                      onClick={() => setInput(label)}
                      className={cn(
                        "group flex items-center gap-2 rounded-full border border-border/70 px-4 py-2",
                        "bg-card/60 text-muted-foreground backdrop-blur-sm transition-all",
                        "hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_18px_-4px_var(--color-primary)]"
                      )}
                    >
                      <span className="opacity-70 transition-opacity group-hover:opacity-100">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-secondary-foreground rounded-bl-sm",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-3 shadow-sm">
                <Shimmer label="Thinking..." />
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-border bg-card/50 p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
              className="min-h-[52px] resize-none rounded-xl"
              disabled={loading}
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="h-11 w-11 shrink-0 rounded-xl">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
