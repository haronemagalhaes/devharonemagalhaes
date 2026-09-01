"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type Mode = "idle" | "hover" | "label";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary";

/**
 * Cursor custom (só desktop com ponteiro fino, sem reduced-motion):
 * ponto que vira um círculo sobre elementos interativos e rótulo "ver"
 * sobre linhas de trabalho (`data-cursor="ver"`). Desligado em touch.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.2 });

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-cursor");
      return;
    }
    document.documentElement.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setMode("label");
        setLabel(labelled.dataset.cursor ?? "");
        return;
      }
      if (target?.closest(INTERACTIVE)) setMode("hover");
      else setMode("idle");
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const size = mode === "label" ? 64 : mode === "hover" ? 40 : 10;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] flex items-center justify-center rounded-full mix-blend-difference"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-white text-black"
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.4 }}
      >
        {mode === "label" && (
          <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
