import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Mail, FileText, ListChecks, Sparkles, Plus, Trash2, LogOut, MessagesSquare } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import { useChatStore } from "@/lib/chat-store";

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
  const { user, logout } = useAuth();
  const { chats, currentId, newChat, selectChat, deleteChat } = useChatStore();

  return (
    <aside
      className="group/sidebar sidebar-glass relative z-40 m-3 flex h-[calc(100svh-1.5rem)] shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-in-out data-[state=collapsed]:w-[60px] data-[state=expanded]:w-[260px]"
      data-state={state}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 py-5 ${collapsed ? "justify-center px-2" : "px-4"}`}>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <p className="truncate font-serif text-lg font-bold leading-none tracking-tight text-foreground">
              Deck
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">Your work co-pilot</p>
          </div>
        )}
      </div>

      <div className="mx-3 mb-2 h-px bg-[rgba(34,211,238,0.08)]" />

      {/* Workspace */}
      <div className="px-2 py-2">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
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
                {active && (
                  <>
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#14b8a6] shadow-[0_0_12px_rgba(20,184,166,0.7)]" />
                    <span className="pointer-events-none absolute left-[-3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#14b8a6] shadow-[0_0_8px_2px_rgba(20,184,166,0.8)]" />
                  </>
                )}
                <item.icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground/60 group-hover/link:text-primary/70"
                  }`}
                />
                {!collapsed && (
                  <span className="text-[13px] font-medium leading-tight">{item.title}</span>
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

      <div className="mx-3 my-2 h-px bg-[rgba(34,211,238,0.08)]" />

      {/* Previous Chats */}
      <div className="flex min-h-0 flex-1 flex-col px-2 pb-2">
        {!collapsed ? (
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Previous Chats
            </p>
            <button
              onClick={newChat}
              title="New chat"
              className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground/70 transition-colors hover:bg-white/5 hover:text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={newChat}
                className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-white/5 hover:text-primary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12} className="border border-primary/20 bg-[rgba(15,23,42,0.85)] px-3 py-1.5 text-xs text-foreground backdrop-blur-md">
              New chat
            </TooltipContent>
          </Tooltip>
        )}

        <div className="flex-1 overflow-y-auto pr-1">
          {chats.length === 0 ? (
            !collapsed && (
              <p className="px-3 py-2 text-[11px] leading-relaxed text-muted-foreground/40">
                No chats yet. Start a conversation and it'll be saved here.
              </p>
            )
          ) : (
            <ul className="flex flex-col gap-0.5">
              {chats.map((c) => {
                const active = c.id === currentId && pathname === "/";
                if (collapsed) {
                  return (
                    <li key={c.id} className="flex justify-center">
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            to="/"
                            onClick={() => selectChat(c.id)}
                            className={`grid h-8 w-8 place-items-center rounded-lg ${active ? "bg-primary/15 text-primary" : "text-muted-foreground/60 hover:bg-white/5 hover:text-foreground"}`}
                          >
                            <MessagesSquare className="h-3.5 w-3.5" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={12} className="max-w-[220px] border border-primary/20 bg-[rgba(15,23,42,0.85)] px-3 py-1.5 text-xs text-foreground backdrop-blur-md">
                          {c.title}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                }
                return (
                  <li key={c.id} className="group/chat">
                    <div
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] transition-colors ${
                        active
                          ? "bg-primary/10 text-foreground"
                          : "text-[#94a3b8] hover:bg-white/[0.03] hover:text-foreground"
                      }`}
                    >
                      <Link
                        to="/"
                        onClick={() => selectChat(c.id)}
                        className="min-w-0 flex-1 truncate"
                      >
                        {c.title || "New chat"}
                      </Link>
                      <button
                        onClick={() => deleteChat(c.id)}
                        title="Delete chat"
                        className="opacity-0 transition-opacity hover:text-destructive group-hover/chat:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom — user */}
      <div className="mx-3 mb-4 mt-auto">
        <div className="mb-3 h-px bg-[rgba(34,211,238,0.08)]" />
        {!collapsed ? (
          <div className="flex items-center gap-2 px-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-semibold uppercase text-primary">
              {user?.name?.[0] ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{user?.name}</p>
              <p className="truncate text-[10px] text-muted-foreground/60">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground/60 transition-colors hover:bg-white/5 hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                className="mx-auto grid h-8 w-8 place-items-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-white/5 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12} className="border border-primary/20 bg-[rgba(15,23,42,0.85)] px-3 py-1.5 text-xs text-foreground backdrop-blur-md">
              Sign out
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}
