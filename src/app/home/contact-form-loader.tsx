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

  return (
    <div ref={ref} aria-busy={!near} className="min-h-[560px]">
      {near ? <ContactForm /> : <FormSkeleton />}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SkeletonField />
        <SkeletonField />
      </div>
      <SkeletonField />
      <div className="flex flex-col gap-3">
        <span className="h-4 w-40 rounded-[4px] bg-surface-2" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <span className="h-12 rounded-[8px] border border-line bg-surface" />
          <span className="h-12 rounded-[8px] border border-line bg-surface" />
          <span className="h-12 rounded-[8px] border border-line bg-surface" />
          <span className="h-12 rounded-[8px] border border-line bg-surface" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="h-4 w-40 rounded-[4px] bg-surface-2" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-10 w-28 rounded-full border border-line bg-surface" />
          ))}
        </div>
      </div>
      <span className="mt-2 h-14 w-48 rounded-[8px] bg-surface-2" />
    </div>
  );
}

function SkeletonField() {
  return (
    <div className="flex flex-col gap-2">
      <span className="h-4 w-24 rounded-[4px] bg-surface-2" />
      <span className="h-[52px] rounded-[8px] border border-line bg-surface" />
    </div>
  );
}
