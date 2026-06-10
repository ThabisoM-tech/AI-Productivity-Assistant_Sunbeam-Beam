import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { planTasks } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shimmer } from "@/components/shimmer";
import { PageShell } from "@/components/page-shell";
import { Markdown } from "@/components/markdown";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner — AI Productivity Assistant" },
      { name: "description", content: "Turn your task list into a smart, motivating daily, weekly, or monthly plan." },
    ],
  }),
  component: TasksPage,
});

type Horizon = "daily" | "weekly" | "monthly";

function TasksPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("daily");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function plan() {
    if (tasks.trim().length < 5) {
      toast.error("Add a few tasks first — even rough ones.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { text } = await run({ data: { tasks, horizon } });
      setResult(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't build the plan. Try again?");
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
    <PageShell title="Task Planner" subtitle="Dump your to-dos. I'll prioritize and time-block them.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary" /> Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={10}
              placeholder={`One task per line. Add a deadline or priority if you have one, e.g.\n- Finish Q3 report (HIGH, due Friday)\n- Reply to client emails\n- Prep slides for Monday standup`}
              className="resize-none rounded-xl"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">Plan for:</p>
              <div className="flex flex-wrap gap-2">
                {(["daily", "weekly", "monthly"] as Horizon[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHorizon(h)}
                    className={
                      "rounded-full border px-4 py-1.5 text-sm capitalize transition-colors " +
                      (horizon === h
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary hover:bg-accent")
                    }
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={plan} disabled={loading} className="w-full rounded-xl">
              {loading ? "Planning..." : "Build My Plan"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your plan</CardTitle>
            {result && !loading && (
              <Button onClick={copy} variant="outline" size="sm" className="rounded-xl">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading && <Shimmer label="Building your schedule..." />}
            {!loading && !result && (
              <p className="text-sm text-muted-foreground">A prioritized, time-blocked plan will appear here.</p>
            )}
            {!loading && result && <Markdown content={result} />}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
