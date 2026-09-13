"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Carrega o formulário (react-hook-form + zod, ~80 KB gz) só quando a seção
 * de contato se aproxima da viewport. Até lá, um esqueleto com a mesma
 * altura evita layout shift.
 */
const ContactForm = dynamic(
  () => import("./contact-form").then((mod) => mod.ContactForm),
  { ssr: false, loading: () => <FormSkeleton /> },
);

export function ContactFormLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /*
   * Sem `min-height` no wrapper: o esqueleto já reserva a altura enquanto
   * carrega, e a antiga min-h-[480px] sobrevivia à troca — sobrava ~30px de
   * vazio embaixo do formulário pra sempre.
   */
  return (
    <div ref={ref} aria-busy={!near}>
      {near ? <ContactForm /> : <FormSkeleton />}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <span className="h-4 w-56 rounded-[4px] bg-surface-2" />
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <SkeletonField />
        <SkeletonField />
      </div>
      <SkeletonField />
      <div className="flex flex-col gap-1.5">
        <span className="h-3.5 w-44 rounded-[4px] bg-surface-2" />
        <span className="mt-1.5 h-3.5 w-32 rounded-[4px] bg-surface-2" />
        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <span className="h-[46px] rounded-[8px] border border-ink/50 bg-surface" />
          <span className="h-[46px] rounded-[8px] border border-ink/50 bg-surface" />
          <span className="h-[46px] rounded-[8px] border border-ink/50 bg-surface" />
          <span className="h-[46px] rounded-[8px] border border-ink/50 bg-surface" />
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <span className="h-14 w-[176px] rounded-[8px] bg-surface-2" />
        <span className="h-4 w-48 max-w-full rounded-[4px] bg-surface-2" />
      </div>
    </div>
  );
}

function SkeletonField() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="h-3.5 w-24 rounded-[4px] bg-surface-2" />
      <span className="h-[46px] rounded-[8px] border border-ink/50 bg-surface" />
    </div>
  );
}
