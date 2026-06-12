import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ChatMsg = { role: "user" | "assistant"; content: string };
export type Chat = {
  id: string;
  title: string;
  messages: ChatMsg[];
  updatedAt: number;
};

type Ctx = {
  chats: Chat[];
  currentId: string | null;
  current: Chat | null;
  newChat: () => string;
  selectChat: (id: string) => void;
  setMessages: (id: string, messages: ChatMsg[]) => void;
  deleteChat: (id: string) => void;
};

const ChatCtx = createContext<Ctx | null>(null);
const KEY = "deck:chats";

function load(): Chat[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Chat[];
  } catch {
    return [];
  }
}

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    setChats(load());
  }, []);

  useEffect(() => {
    if (chats.length > 0) localStorage.setItem(KEY, JSON.stringify(chats));
    else localStorage.removeItem(KEY);
  }, [chats]);

  const newChat = () => {
    const id = crypto.randomUUID();
    const chat: Chat = { id, title: "New chat", messages: [], updatedAt: Date.now() };
    setChats((c) => [chat, ...c]);
    setCurrentId(id);
    return id;
  };

  const selectChat = (id: string) => setCurrentId(id);

  const setMessages = (id: string, messages: ChatMsg[]) => {
    setChats((all) => {
      const exists = all.some((c) => c.id === id);
      const title =
        messages.find((m) => m.role === "user")?.content?.slice(0, 48) || "New chat";
      if (!exists) {
        return [{ id, title, messages, updatedAt: Date.now() }, ...all];
      }
      return all
        .map((c) =>
          c.id === id ? { ...c, messages, title, updatedAt: Date.now() } : c,
        )
        .sort((a, b) => b.updatedAt - a.updatedAt);
    });
  };

  const deleteChat = (id: string) => {
    setChats((all) => all.filter((c) => c.id !== id));
    setCurrentId((cur) => (cur === id ? null : cur));
  };

  const current = useMemo(
    () => chats.find((c) => c.id === currentId) ?? null,
    [chats, currentId],
  );

  return (
    <ChatCtx.Provider
      value={{ chats, currentId, current, newChat, selectChat, setMessages, deleteChat }}
    >
      {children}
    </ChatCtx.Provider>
  );
}

export function useChatStore() {
  const v = useContext(ChatCtx);
  if (!v) throw new Error("useChatStore outside provider");
  return v;
}
