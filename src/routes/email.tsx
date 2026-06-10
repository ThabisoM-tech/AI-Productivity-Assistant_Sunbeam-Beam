import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Check, Mail } from "lucide-react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shimmer } from "@/components/shimmer";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — AI Productivity Assistant" },
      { name: "description", content: "Generate polished, ready-to-send professional emails in seconds." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional & friendly");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!recipient.trim() || !purpose.trim()) {
      toast.error("Add a recipient and a purpose first.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { text } = await run({ data: { recipient, purpose, tone, details } });
      setResult(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't generate the email. Try again?");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard ✨");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <PageShell title="Email Generator" subtitle="Tell me the basics — I'll draft something sendable.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recipient</Label>
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah, my manager" />
            </div>
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Request time off next week" />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Professional & friendly", "Formal", "Casual", "Apologetic", "Assertive", "Grateful", "Persuasive"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Key details</Label>
              <Textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={5} placeholder="Dates, context, names, anything important to include..." />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full rounded-xl">
              {loading ? "Drafting..." : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your draft</CardTitle>
            {result && !loading && (
              <Button onClick={copy} variant="outline" size="sm" className="rounded-xl">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading && <Shimmer label="Crafting your email..." />}
            {!loading && !result && (
              <p className="text-sm text-muted-foreground">Your generated email will show up here.</p>
            )}
            {!loading && result && (
              <pre className="whitespace-pre-wrap rounded-xl bg-secondary p-4 font-sans text-sm leading-relaxed">{result}</pre>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
