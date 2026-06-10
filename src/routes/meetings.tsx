import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shimmer } from "@/components/shimmer";
import { PageShell } from "@/components/page-shell";
import { Markdown } from "@/components/markdown";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — AI Productivity Assistant" },
      { name: "description", content: "Turn messy meeting notes into clean, scannable summaries with action items." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function summarize() {
    if (notes.trim().length < 20) {
      toast.error("Paste a bit more — I need something to work with.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { text } = await run({ data: { notes } });
      setResult(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't summarize. Try again?");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied ✨");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <PageShell title="Meeting Summarizer" subtitle="Paste your notes or transcript — I'll structure it.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Raw notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={14}
              placeholder="Paste meeting notes, transcript, or a brain dump here..."
              className="resize-none rounded-xl"
            />
            <Button onClick={summarize} disabled={loading} className="w-full rounded-xl">
              {loading ? "Summarizing..." : "Summarize Meeting"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Summary</CardTitle>
            {result && !loading && (
              <Button onClick={copy} variant="outline" size="sm" className="rounded-xl">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading && <Shimmer label="Pulling out the highlights..." />}
            {!loading && !result && (
              <p className="text-sm text-muted-foreground">Your structured summary will land here.</p>
            )}
            {!loading && result && <Markdown content={result} />}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
