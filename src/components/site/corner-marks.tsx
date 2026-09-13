import { cn } from "@/lib/utils";

/** Quatro marcas de canto em "L", traço 1px em --line (ou --ink). */
export function CornerMarks({
  className,
  size = 14,
  color = "var(--line)",
  inset = 0,
}: {
  className?: string;
  size?: number;
  color?: string;
  inset?: number;
}) {
  const s = `${size}px`;
  const common = {
    width: s,
    height: s,
    borderColor: color,
  } as const;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ inset: -inset }}
    >
      <span className="absolute left-0 top-0 border-l border-t" style={common} />
      <span className="absolute right-0 top-0 border-r border-t" style={common} />
      <span className="absolute bottom-0 left-0 border-b border-l" style={common} />
      <span className="absolute bottom-0 right-0 border-b border-r" style={common} />
    </div>
  );
}
