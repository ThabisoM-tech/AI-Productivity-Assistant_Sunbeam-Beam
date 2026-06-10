import { cn } from "@/lib/utils";

export function Shimmer({ className, label = "Thinking..." }: { className?: string; label?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="bg-gradient-to-r from-primary/40 via-primary to-primary/40 bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_2s_linear_infinite]">
          {label}
        </span>
      </div>
      <div className="space-y-2">
        <ShimmerBar w="w-5/6" />
        <ShimmerBar w="w-4/6" />
        <ShimmerBar w="w-3/6" />
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

function ShimmerBar({ w }: { w: string }) {
  return (
    <div
      className={cn(
        "h-3 rounded-full",
        w,
        "bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 bg-[length:200%_100%] animate-[shimmer_1.6s_linear_infinite]",
      )}
    />
  );
}
