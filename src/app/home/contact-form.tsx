"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { Toaster, toast } from "sonner";
import { StudioButton } from "@/components/site/studio-button";
import { Checkbox } from "@/components/ui/checkbox";
import { GOALS, contactSchema, labelFor, type ContactInput } from "@/lib/contact-schema";
import { EASE } from "@/lib/motion";
import { EMAIL, RESPONSE_TIME, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * Envio direto do client pelo FormSubmit.co (AJAX, sem backend, sem cadastro).
 *
 * PENDÊNCIA (Harone):
 *   1. No 1º envio real o FormSubmit manda um e-mail de ativação para EMAIL —
 *      clicar no link. Antes disso nada chega.
 *   2. Depois de ativar, trocar `EMAIL` abaixo pelo hash que o FormSubmit
 *      fornece (formsubmit.co/ajax/<hash>) para o e-mail sair do JS do site.
 */
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;

type Status = "idle" | "sending" | "sent";

const fieldCls =
  "w-full rounded-[8px] border border-line bg-surface px-4 py-3.5 text-[16px] text-ink placeholder:text-ink-soft/70 transition-colors duration-300 focus:border-ink focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-destructive";

/** "+55 (79) 9 8116-4388" → "5579981164388" */
function waDigits(raw: string) {
  const d = raw.replace(/\D/g, "");
  return d.startsWith("55") && d.length >= 12 ? d : `55${d}`;
}

function buildPayload(d: ContactInput) {
  return {
    Nome: d.name,
    WhatsApp: d.whatsapp,
    "Contato WhatsApp": `https://wa.me/${waDigits(d.whatsapp)}`,
    "Tipo de negócio": d.business,
    "O que quer resolver": d.goals.map((g) => labelFor(GOALS, g)).join(", "),
    _subject: `Novo contato pelo site — ${d.name}`,
    _template: "table",
    _captcha: "false",
  };
}

/**
 * Formulário "Vamos conversar" (react-hook-form + zod → FormSubmit.co).
 * Carregado sob demanda por `ContactFormLoader` — fica fora do bundle inicial.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", whatsapp: "", business: "", goals: [], _honey: "" },
  });

  const onSubmit = async (data: ContactInput) => {
    // honeypot preenchido → bot: finge que enviou, sem chamar nada
    if (data._honey) {
      reset();
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(buildPayload(data)),
      });
      const json = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
      if (res.ok && String(json?.success) === "true") {
        reset();
        setStatus("sent");
        return;
      }
      throw new Error("formsubmit");
    } catch {
      setStatus("idle"); // mantém o que foi digitado
      toast.error("Não consegui enviar agora.", {
        description: "Tenta de novo em instantes ou chama no WhatsApp.",
      });
    }
  };

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          classNames: {
            toast: "!rounded-[8px] !border-line !bg-surface !text-ink !shadow-none font-sans",
            description: "!text-ink-soft",
          },
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <m.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            role="status"
            className="rounded-[8px] border border-line bg-surface p-8 md:p-10"
          >
            <p className="font-display text-[26px] font-bold tracking-[-0.02em] text-ink">
              Recebido.
            </p>
            <p className="mt-2 text-[17px] text-ink-soft">Respondo em até 1 dia útil.</p>
          </m.div>
        ) : (
          <m.form
            key="form"
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
          >
            {/* honeypot — fora do fluxo e do tab; bot preenche, humano nem vê */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              style={{ display: "none" }}
              {...register("_honey")}
            />

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

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
              <StudioButton
                type="submit"
                size="lg"
                arrow
                disabled={status === "sending"}
                aria-busy={status === "sending"}
                className="disabled:cursor-progress disabled:opacity-70"
              >
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
    </>
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
