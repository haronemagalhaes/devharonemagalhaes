"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/site/eyebrow";
import { StudioButton } from "@/components/site/studio-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BUDGETS,
  GOALS,
  contactSchema,
  labelFor,
  type ContactInput,
} from "@/lib/contact-schema";
import { EASE } from "@/lib/motion";
import {
  CONTACT_ID,
  CTA_SECONDARY_WHATSAPP,
  EMAIL,
  RESPONSE_TIME,
  whatsappUrl,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "fallback";

const fieldCls =
  "w-full rounded-[8px] border border-line bg-surface px-4 py-3.5 text-[16px] text-ink placeholder:text-ink-soft/70 transition-colors duration-300 focus:border-ink focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-destructive";

function buildWhatsappMessage(d: ContactInput) {
  return [
    `Olá, Harone! Vim pelo site.`,
    `Nome: ${d.name}`,
    `WhatsApp: ${d.whatsapp}`,
    `Negócio: ${d.business}`,
    `Quero resolver: ${d.goals.map((g) => labelFor(GOALS, g)).join(", ")}`,
    `Investimento previsto: ${labelFor(BUDGETS, d.budget)}`,
  ].join("\n");
}

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [fallbackUrl, setFallbackUrl] = useState<string>(whatsappUrl());

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", whatsapp: "", business: "", goals: [], budget: undefined, website: "" },
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus("sending");
    setFallbackUrl(whatsappUrl(buildWhatsappMessage(data)));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; delivered?: boolean };
      setStatus(json.ok && json.delivered ? "sent" : "fallback");
    } catch {
      setStatus("fallback");
    }
  };

  return (
    <section id={CONTACT_ID} className="section-pad" aria-labelledby="contato-title">
      <div className="container-studio grid grid-cols-12 gap-x-6 gap-y-12">
        <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-5">
          <Eyebrow index="09">Contato</Eyebrow>
          <h2
            id="contato-title"
            className="font-display text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[34px] md:text-[44px]"
          >
            Vamos conversar
          </h2>
          <p className="max-w-[420px] text-[17px] leading-relaxed text-ink-soft md:text-lg">
            Cinco perguntas rápidas. Com isso eu já chego na primeira conversa
            sabendo por onde começar.
          </p>
          <dl className="mt-4 flex flex-col gap-3 text-[15px]">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-ink-soft">E-mail</dt>
              <dd>
                <a href={`mailto:${EMAIL}`} className="link-line text-ink">
                  {EMAIL}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-ink-soft">WhatsApp</dt>
              <dd>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-ink"
                >
                  +55 79 98116-4388
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-ink-soft">Prazo</dt>
              <dd className="text-ink">{RESPONSE_TIME}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1} className="col-span-12 lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" || status === "fallback" ? (
              <m.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                role="status"
                className="rounded-[8px] border border-line bg-surface p-8 md:p-10"
              >
                {status === "sent" ? (
                  <>
                    <p className="font-display text-[26px] font-bold tracking-[-0.02em] text-ink">
                      Recebido.
                    </p>
                    <p className="mt-2 text-[17px] text-ink-soft">
                      Respondo em até 1 dia útil.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-[26px] font-bold tracking-[-0.02em] text-ink">
                      Quase lá.
                    </p>
                    <p className="mt-2 max-w-[46ch] text-[17px] text-ink-soft">
                      O envio por aqui ainda não está ativo. Manda direto pelo
                      WhatsApp — a mensagem já vai preenchida com o que você
                      escreveu.
                    </p>
                    <div className="mt-6">
                      <StudioButton
                        href={fallbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        arrow
                      >
                        {CTA_SECONDARY_WHATSAPP}
                      </StudioButton>
                    </div>
                  </>
                )}
              </m.div>
            ) : (
              <m.form
                key="form"
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-6"
              >
                {/* honeypot */}
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
                  <label>
                    Não preencha
                    <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field label="Nome" htmlFor="c-name" error={errors.name?.message}>
                    <input
                      id="c-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Como te chamo?"
                      aria-invalid={!!errors.name}
                      className={fieldCls}
                      {...register("name")}
                    />
                  </Field>
                  <Field label="WhatsApp" htmlFor="c-whats" error={errors.whatsapp?.message}>
                    <input
                      id="c-whats"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(79) 9 9999-9999"
                      aria-invalid={!!errors.whatsapp}
                      className={fieldCls}
                      {...register("whatsapp")}
                    />
                  </Field>
                </div>

                <Field label="Tipo de negócio" htmlFor="c-business" error={errors.business?.message}>
                  <input
                    id="c-business"
                    type="text"
                    placeholder="Ex.: clínica, escritório, loja, indústria…"
                    aria-invalid={!!errors.business}
                    className={fieldCls}
                    {...register("business")}
                  />
                </Field>

                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-3 text-[14px] font-medium text-ink">
                    O que você quer resolver
                  </legend>
                  <Controller
                    control={control}
                    name="goals"
                    render={({ field }) => (
                      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {GOALS.map((g) => {
                          const checked = field.value?.includes(g.value);
                          return (
                            <li key={g.value}>
                              <label
                                className={cn(
                                  "flex min-h-[48px] cursor-pointer items-center gap-3 rounded-[8px] border bg-surface px-4 py-3 text-[15px] transition-colors duration-300",
                                  checked ? "border-ink" : "border-line hover:bg-surface-2",
                                )}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(v) => {
                                    const next = new Set(field.value ?? []);
                                    if (v) next.add(g.value);
                                    else next.delete(g.value);
                                    field.onChange(Array.from(next));
                                  }}
                                  className="border-ink data-[state=checked]:bg-ink data-[state=checked]:text-bg"
                                />
                                {g.label}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  />
                  {errors.goals && <FieldError>{errors.goals.message as string}</FieldError>}
                </fieldset>

                <fieldset className="flex flex-col gap-3">
                  <legend className="mb-3 text-[14px] font-medium text-ink">
                    Investimento previsto
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <label
                        key={b.value}
                        className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2.5 text-[14px] text-ink transition-colors duration-300 hover:bg-surface-2 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bg has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
                      >
                        <input
                          type="radio"
                          value={b.value}
                          className="sr-only"
                          {...register("budget")}
                        />
                        {b.label}
                      </label>
                    ))}
                  </div>
                  {errors.budget && <FieldError>{errors.budget.message}</FieldError>}
                </fieldset>

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                  <StudioButton type="submit" size="lg" arrow disabled={status === "sending"}>
                    {status === "sending" ? "Enviando…" : "Enviar"}
                  </StudioButton>
                  <p className="text-[13px] text-ink-soft">
                    Ou{" "}
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-line text-ink"
                    >
                      chama no WhatsApp
                    </a>
                    . {RESPONSE_TIME}.
                  </p>
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[14px] font-medium text-ink">
        {label}
      </label>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="text-[13px] text-destructive">
      {children}
    </p>
  );
}
