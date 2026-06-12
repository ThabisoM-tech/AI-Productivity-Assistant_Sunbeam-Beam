import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { chatComplete } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Shimmer } from "@/components/shimmer";
import { PageShell } from "@/components/page-shell";
import { CompassRose } from "@/components/compass-rose";
import { useChatStore } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deck — Chat" },
      { name: "description", content: "Your friendly AI co-pilot for everyday work tasks." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const run = useServerFn(chatComplete);
  const { current, currentId, newChat, setMessages } = useChatStore();
  const messages = current?.messages ?? [];
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentId) newChat();
  }, [currentId, newChat]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const id = currentId ?? newChat();
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(id, next);
    setInput("");
    setLoading(true);
    try {
      const { text: reply } = await run({ data: { messages: next } });
      setMessages(id, [...next, { role: "assistant", content: reply }]);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 9e6, behavior: "smooth" }), 50);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went sideways. Try again?");
    } finally {
      setLoading(false);
    }
  }

  const titleNode = (
    <div className="space-y-2">
      <span className="block font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
        Locking in.
      </span>
      <span className="block font-serif text-xl font-medium italic text-muted-foreground sm:text-2xl">
        Drop your drafts, notes, or tasks here and let’s get it done.
      </span>
    </div>
  );

  return (
    <PageShell
      title={titleNode}
      subtitle="Drop your drafts, notes, or tasks here — we’ll move them forward together."
    >
      <Card className="glass-panel subtle-gradient-border flex h-[calc(100vh-220px)] min-h-[460px] flex-col overflow-hidden bg-card/40">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !loading && (
            <div className="grid h-full place-items-center text-center">
              <div className="max-w-xl">
                <div className="mb-7 inline-flex">
                  <div className="vintage-icon">
                    <CompassRose className="h-12 w-12" />
                  </div>
                </div>
                <p className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                  Locking in. Where should we start?
                </p>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Pick a quick-start below or type your own prompt.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2.5 text-xs sm:text-sm">
                  {[
                    { label: "Draft a follow-up email", icon: "✉️" },
                    { label: "Summarize my week", icon: "📊" },
                    { label: "Plan my Monday", icon: "🗓️" },
                  ].map(({ label, icon }) => (
                    <button
                      key={label}
                      onClick={() => setInput(label)}
                      className="chip-interactive group flex items-center gap-2 rounded-full px-4 py-2 text-foreground/80 hover:text-foreground"
                    >
                      <span className="opacity-80 transition-opacity group-hover:opacity-100">{icon}</span>
                      <span className="font-medium">{label}</span>
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
