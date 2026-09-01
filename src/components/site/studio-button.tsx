"use client";

import { useRef, type ComponentProps, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/components/motion/smooth-scroll";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = BaseProps &
  Omit<ComponentProps<"button">, "children" | "className"> & { href?: undefined };
type AnchorProps = BaseProps &
  Omit<ComponentProps<"a">, "children" | "className"> & { href: string };

type Props = ButtonProps | AnchorProps;

const MAGNET = 6; // px

const base =
  "group relative inline-flex min-h-[44px] select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[8px] font-medium leading-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-bg",
  secondary:
    "border border-ink bg-transparent text-ink hover:bg-surface-2 transition-[background-color,border-color] duration-300",
};

const sizes: Record<Size, string> = {
  md: "px-[22px] py-[14px] text-[15px]",
  lg: "px-7 py-4 text-base",
};

/**
 * Botão do sistema: primário (fill-wipe + magnético) e secundário (contorno).
 * Se `href` começa com "#", faz scroll suave com offset do header.
 */
export function StudioButton(props: Props) {
  const {
    variant = "primary",
    size = "md",
    arrow = false,
    className,
    children,
    ...rest
  } = props;

  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.3 });

  const onMove = (e: MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * MAGNET);
    y.set(Math.max(-1, Math.min(1, dy)) * MAGNET);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <>
      {variant === "primary" && !reduced && (
        <span
          aria-hidden
          className="motion-wipe pointer-events-none absolute inset-0 translate-y-full bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {arrow && (
          <ArrowRight
            className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            aria-hidden
          />
        )}
      </span>
    </>
  );

  const cls = cn(base, variants[variant], sizes[size], className);
  const style = { x: sx, y: sy };

  if ("href" in props && typeof props.href === "string") {
    const { href, onClick, ...anchorRest } = rest as Omit<AnchorProps, keyof BaseProps>;
    const isHash = href.startsWith("#");
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={cls}
        style={style}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={(e) => {
          onClick?.(e);
          if (isHash && !e.defaultPrevented) {
            e.preventDefault();
            scrollToId(href.slice(1));
          }
        }}
        {...(anchorRest as Omit<ComponentProps<typeof motion.a>, "ref" | "style">)}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={cls}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...(rest as Omit<ComponentProps<typeof motion.button>, "ref" | "style">)}
    >
      {content}
    </motion.button>
  );
}
