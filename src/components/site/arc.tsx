import { cn } from "@/lib/utils";

/**
 * Arcos concêntricos finos (sistema gráfico da marca). Sem preenchimento,
 * traço em --line. `rings` controla quantos arcos.
 */
export function Arc({
  className,
  rings = 6,
  stroke = "var(--line)",
}: {
  className?: string;
  rings?: number;
  stroke?: string;
}) {
  const size = 1000;
  const step = size / 2 / rings;
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${size} ${size}`}
      className={cn("pointer-events-none select-none", className)}
      fill="none"
    >
      {Array.from({ length: rings }).map((_, i) => (
        <circle
          key={i}
          cx={size / 2}
          cy={size / 2}
          r={step * (i + 1) - 1}
          stroke={stroke}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
