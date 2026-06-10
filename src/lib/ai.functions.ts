import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "system" | "user" | "assistant"; content: string };

async function callGemini(messages: Msg[]): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI service is not configured.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("We're hitting our rate limit. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits are out. Add more in your workspace billing.");
    throw new Error(`AI request failed (${res.status}). ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const out = data.choices?.[0]?.message?.content ?? "";
  if (!out) throw new Error("Empty response from the AI. Please try again.");
  return out;
}

const SYSTEM_BASE =
  "You are an upbeat, smart, and human AI productivity assistant for working professionals. Keep tone helpful, light, slightly Gen-Z but still professional. Never robotic. Use clean markdown when helpful.";

export const chatComplete = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: Msg[] }) => d)
  .handler(async ({ data }) => {
    const text = await callGemini([
      { role: "system", content: `${SYSTEM_BASE} You're the general assistant. Answer any work-related request clearly and concisely.` },
      ...data.messages,
    ]);
    return { text };
  });

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: { recipient: string; purpose: string; tone: string; details: string }) => d)
  .handler(async ({ data }) => {
    const prompt = `Write a ready-to-send professional email.

Recipient: ${data.recipient}
Purpose: ${data.purpose}
Tone: ${data.tone}
Key details: ${data.details}

Format strictly as:
Subject: <subject line>

<email body with proper greeting and sign-off>

Do NOT add commentary before or after. Keep it concise, warm, and human.`;
    const text = await callGemini([
      { role: "system", content: `${SYSTEM_BASE} You write polished business emails that sound human, not stiff.` },
      { role: "user", content: prompt },
    ]);
    return { text };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: { notes: string }) => d)
  .handler(async ({ data }) => {
    const prompt = `Summarize the following meeting notes / transcript into a clean, scannable structure using markdown.

Use exactly these sections:
## TL;DR
(2-3 sentence overview)

## Key Discussion Points
- bullet list

## Decisions Made
- bullet list

## Action Items
| Task | Owner | Due |
|------|-------|-----|

## Open Questions
- bullet list

Raw notes:
"""
${data.notes}
"""`;
    const text = await callGemini([
      { role: "system", content: `${SYSTEM_BASE} You turn messy meeting notes into crisp, scannable summaries.` },
      { role: "user", content: prompt },
    ]);
    return { text };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: { tasks: string; horizon: "daily" | "weekly" | "monthly" }) => d)
  .handler(async ({ data }) => {
    const prompt = `Organize these tasks into a ${data.horizon} schedule. Suggest a smart order, realistic time estimates, and flag what's urgent.

Output in markdown:

## ⚡ Urgent — do first
- task — ~time — why it matters

## 📅 ${data.horizon[0].toUpperCase() + data.horizon.slice(1)} Plan
For daily: time-blocked list (e.g. "9:00–9:45 — task").
For weekly: group by day (Mon, Tue...).
For monthly: group by week (Week 1, Week 2...).

## 💡 Tips & Reminders
- 2-4 short encouraging reminders to keep momentum.

Tasks:
${data.tasks}`;
    const text = await callGemini([
      { role: "system", content: `${SYSTEM_BASE} You're a sharp planner who creates realistic, motivating schedules.` },
      { role: "user", content: prompt },
    ]);
    return { text };
  });
