export function CompassRose({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="15" strokeDasharray="2 3" opacity="0.55" />
      <circle cx="32" cy="32" r="2.2" fill="currentColor" />
      {/* Cardinal points (sharp inner vector lines) */}
      <path d="M32 6 L34.5 30 L32 32 L29.5 30 Z" fill="currentColor" fillOpacity="0.9" />
      <path d="M32 58 L29.5 34 L32 32 L34.5 34 Z" fill="currentColor" fillOpacity="0.55" />
      <path d="M6 32 L30 29.5 L32 32 L30 34.5 Z" fill="currentColor" fillOpacity="0.7" />
      <path d="M58 32 L34 34.5 L32 32 L34 29.5 Z" fill="currentColor" fillOpacity="0.7" />
      {/* Diagonal rays */}
      <path d="M14 14 L30 30 M50 14 L34 30 M14 50 L30 34 M50 50 L34 34" opacity="0.45" />
      {/* Ticks */}
      <g opacity="0.5">
        <line x1="32" y1="10" x2="32" y2="13" />
        <line x1="32" y1="51" x2="32" y2="54" />
        <line x1="10" y1="32" x2="13" y2="32" />
        <line x1="51" y1="32" x2="54" y2="32" />
      </g>
    </svg>
  );
}
