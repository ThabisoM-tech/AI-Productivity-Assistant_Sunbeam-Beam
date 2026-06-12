import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim(), name.trim() || undefined);
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-4">
      <div className="glow-turquoise" />
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel p-8 sm:p-10" style={{ border: "1px solid rgba(34, 211, 238, 0.15)" }}>
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_24px_-4px_rgba(20,184,166,0.6)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">Deck</h1>
              <p className="text-xs text-muted-foreground">Your work co-pilot</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-serif text-3xl font-bold leading-tight text-foreground">
              {mode === "signin" ? "Welcome back." : "Get on Deck."}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in and pick up where you left off."
                : "Create your space — drafts, notes, and tasks all in one place."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="h-11 rounded-xl bg-background/40"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@work.com"
                className="h-11 rounded-xl bg-background/40"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl bg-background/40"
              />
            </div>

            <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold">
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "New to Deck? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
        <p className="mt-4 text-center text-[11px] text-muted-foreground/50">
          By continuing you agree to be productive. That's the only rule.
        </p>
      </div>
    </div>
  );
}
