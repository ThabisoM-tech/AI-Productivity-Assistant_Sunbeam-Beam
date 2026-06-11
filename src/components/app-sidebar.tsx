import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Mail, FileText, ListChecks, Sparkles } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const items = [
  { title: "Chat Assistant", url: "/", icon: MessageCircle },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", url: "/meetings", icon: FileText },
  { title: "Task Planner", url: "/tasks", icon: ListChecks },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className="group/sidebar sidebar-glass relative z-40 flex h-svh shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-in-out data-[state=collapsed]:w-[60px] data-[state=expanded]:w-[260px]"
      data-state={state}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 py-5 ${collapsed ? "justify-center px-2" : "px-4"}`}>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">
              AI Productivity
            </p>
            <p className="truncate text-xs text-muted-foreground">Your work co-pilot</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 mb-2 h-px bg-[rgba(34,211,238,0.08)]" />

      {/* Workspace Section */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Workspace
          </p>
        )}
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => {
            const active = pathname === item.url;

            const NavLink = (
              <Link
                to={item.url}
                className={`group/link relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                  active
                    ? "text-primary"
                    : "text-[#94a3b8] hover:bg-white/[0.03] hover:text-foreground"
                } ${collapsed ? "justify-center" : ""}`}
              >
                {/* Active indicator — glowing vertical pill */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                )}
                <item.icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground/60 group-hover/link:text-primary/70"
                  }`}
                />
                {!collapsed && (
                  <span className="text-[13px] font-medium leading-tight">
                    {item.title}
                  </span>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.url} delayDuration={0}>
                  <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className="flex items-center gap-2 border border-primary/20 bg-[rgba(15,23,42,0.85)] px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-md"
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return NavLink;
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="mx-3 mb-4 mt-auto">
        <div className="mb-3 h-px bg-[rgba(34,211,238,0.08)]" />
        {!collapsed ? (
          <div className="px-3 py-2">
            <p className="text-[10px] leading-relaxed text-muted-foreground/40">
              AI-generated content may be inaccurate. Verify before acting.
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          </div>
        )}
      </div>
    </aside>
  );
}
