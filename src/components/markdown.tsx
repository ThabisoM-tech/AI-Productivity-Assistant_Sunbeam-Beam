// Lightweight markdown renderer — enough for headings, bold, lists, tables.
// Keeps deps zero. For richer rendering, swap with react-markdown later.

import { Fragment } from "react";

export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {blocks.map((b, i) => (
        <Fragment key={i}>{renderBlock(b)}</Fragment>
      ))}
    </div>
  );
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      out.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      out.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, "").trim());
        i++;
      }
      out.push({ type: "ul", items });
      continue;
    }
    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\s*\|?\s*:?-+/.test(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      out.push({ type: "table", header, rows });
      continue;
    }
    // paragraph: gather until blank
    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !/^\s*[-*]\s+/.test(lines[i]) && !lines[i].trim().startsWith("|")) {
      para.push(lines[i]);
      i++;
    }
    out.push({ type: "p", text: para.join(" ") });
  }
  return out;
}

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function renderInline(text: string) {
  // bold **x**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    ),
  );
}

function renderBlock(b: Block) {
  switch (b.type) {
    case "h2":
      return <h2 className="mt-2 text-base font-semibold text-foreground">{renderInline(b.text)}</h2>;
    case "h3":
      return <h3 className="mt-1 text-sm font-semibold text-foreground">{renderInline(b.text)}</h3>;
    case "p":
      return <p className="text-foreground/90">{renderInline(b.text)}</p>;
    case "ul":
      return (
        <ul className="ml-4 list-disc space-y-1 text-foreground/90 marker:text-primary">
          {b.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary">
              <tr>
                {b.header.map((h, i) => (
                  <th key={i} className="px-3 py-2 font-semibold">{renderInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {row.map((c, j) => (
                    <td key={j} className="px-3 py-2 align-top">{renderInline(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
