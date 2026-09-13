"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { Check } from "lucide-react";
import { Toaster, toast } from "sonner";
import { StudioButton } from "@/components/site/studio-button";
import { GOALS, contactSchema, labelFor, type ContactInput } from "@/lib/contact-schema";
import { EASE } from "@/lib/motion";
import { EMAIL, whatsappUrl } from "@/lib/site";
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

/** idle → sending → sent (botão "Enviado") → done (painel de confirmação) */
type Status = "idle" | "sending" | "sent" | "done";

/** quanto o botão fica em "Enviado" antes do painel entrar */
const SENT_HOLD_MS = 750;

/*
 * Caixa base do formulário. Campo e opção compartilham exatamente o mesmo
 * desenho — raio, borda, fundo, tipografia e altura (46px: 11px de padding +
 * 22px de linha + 2px de borda). Um formulário coerente tem uma caixa só.
 * A borda usa --ink a 50%: visível sobre --surface e sobre --bg, nos dois
 * temas, ao contrário de --line, que quase somia.
 */
const boxBase =
  "w-full rounded-[8px] border border-ink/50 bg-surface px-3.5 py-[11px] text-[16px] leading-[1.375] text-ink transition-[border-color,background-color,color] duration-200";

/* O foco usa o mesmo anel de 2px do resto do site — o `outline-none` de antes
   matava o único sinal que quem navega por teclado tinha. */
const fieldCls = `${boxBase} placeholder:text-ink-soft hover:border-ink/70 focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-[invalid=true]:border-destructive`;

/*
 * Opção: a mesma caixa, item inteiro clicável. Selecionado = preenchido em
 * --ink com o texto em --bg e peso 500 — nunca cor.
 * `peer-checked:hover:*` é obrigatório: sem ele o `hover:bg-surface-2` vence
 * o `peer-checked:bg-ink` e a opção marcada fica cinza sob o mouse.
 */
const optionCls = `${boxBase} flex min-h-[46px] cursor-pointer select-none items-center hover:border-ink hover:bg-surface-2 peer-checked:border-ink peer-checked:bg-ink peer-checked:font-medium peer-checked:text-bg peer-checked:hover:bg-ink peer-checked:hover:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink`;

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
  const uid = useId();

  /*
   * Callback ref em vez de useEffect: com `mode="wait"` o painel só monta
   * depois da saída do formulário — num efeito o ref ainda seria null e o
   * foco caía no <body>.
   */
  const focusDone = useCallback((el: HTMLDivElement | null) => {
    el?.focus();
  }, []);

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

  /* "Enviado" fica um instante no botão; depois o painel entra. */
  useEffect(() => {
    if (status !== "sent") return;
    const t = setTimeout(() => setStatus("done"), SENT_HOLD_MS);
    return () => clearTimeout(t);
  }, [status]);

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

  const busy = status !== "idle";
  const goalsErrorId = `${uid}-goals-error`;
  const goalsHintId = `${uid}-goals-hint`;

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
        {status === "done" ? (
          <m.div
            key="done"
            ref={focusDone}
            tabIndex={-1}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            role="status"
            className="rounded-[8px] border border-ink/50 bg-surface p-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:p-10"
          >
            <p className="font-display text-[26px] font-semibold tracking-[-0.015em] text-ink">
              Recebido.
            </p>
            {/* sem prazo: a promessa de "1 dia útil" saiu do site inteiro */}
            <p className="mt-2 text-[17px] text-ink-soft">
              Suas respostas chegaram aqui. Eu te retorno.
            </p>
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

            {/* todos os campos são obrigatórios — um aviso só, sem 4 asteriscos */}
            <p className="eyebrow !normal-case !tracking-normal !text-[13px]">
              Todos os campos são obrigatórios.
            </p>

            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <Field
                label="Nome"
                htmlFor="c-name"
                errorId={`${uid}-name-error`}
                error={errors.name?.message}
              >
                <input
                  id="c-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Nome completo"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                  className={fieldCls}
                  {...register("name")}
                />
              </Field>
              <Field
                label="WhatsApp"
                htmlFor="c-whats"
                errorId={`${uid}-whats-error`}
                error={errors.whatsapp?.message}
              >
                <input
                  id="c-whats"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(79) 9 9999-9999"
                  aria-invalid={!!errors.whatsapp}
                  aria-describedby={errors.whatsapp ? `${uid}-whats-error` : undefined}
                  className={fieldCls}
                  {...register("whatsapp")}
                />
              </Field>
            </div>

            <Field
              label="Tipo de negócio"
              htmlFor="c-business"
              errorId={`${uid}-business-error`}
              error={errors.business?.message}
            >
              <input
                id="c-business"
                type="text"
                required
                placeholder="Ex.: clínica, escritório, loja, indústria…"
                aria-invalid={!!errors.business}
                aria-describedby={errors.business ? `${uid}-business-error` : undefined}
                className={fieldCls}
                {...register("business")}
              />
            </Field>

            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-[13px] font-medium leading-none text-ink">
                O que você quer resolver
              </legend>
              <p id={goalsHintId} className="mb-2.5 text-[13px] text-ink-soft">
                Marque quantas quiser.
              </p>
              <Controller
                control={control}
                name="goals"
                render={({ field }) => (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {GOALS.map((g, i) => {
                      const checked = !!field.value?.includes(g.value);
                      return (
                        <label key={g.value} className="flex">
                          {/* input real: o <label> inteiro é o alvo, Tab e Espaço funcionam */}
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            ref={i === 0 ? field.ref : undefined}
                            checked={checked}
                            aria-describedby={
                              errors.goals ? `${goalsHintId} ${goalsErrorId}` : goalsHintId
                            }
                            onBlur={field.onBlur}
                            onChange={(e) => {
                              const next = new Set(field.value ?? []);
                              if (e.target.checked) next.add(g.value);
                              else next.delete(g.value);
                              field.onChange(Array.from(next));
                            }}
                          />
                          <span className={optionCls}>{g.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
              {errors.goals && (
                <FieldError id={goalsErrorId} className="mt-2.5">
                  {errors.goals.message as string}
                </FieldError>
              )}
            </fieldset>

            <div className="flex flex-col items-start gap-3 pt-2">
              <StudioButton
                type="submit"
                size="lg"
                arrow={status === "idle"}
                disabled={busy}
                aria-busy={status === "sending"}
                className="min-w-[176px] disabled:opacity-100 [&:disabled]:cursor-default"
              >
                {status === "idle" && "Enviar"}
                {status === "sending" && (
                  <>
                    <Spinner />
                    Enviando…
                  </>
                )}
                {status === "sent" && (
                  <>
                    <Check className="h-4 w-4" aria-hidden />
                    Enviado
                  </>
                )}
              </StudioButton>
              <p className="text-[13px] leading-relaxed text-ink-soft">
                Ou{" "}
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-ink-soft transition-colors duration-300 hover:text-ink"
                >
                  chama no WhatsApp
                </a>
                .
              </p>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </>
  );
}

/** Rótulo 13px colado no campo — o par fica junto, os pares ficam longe. */
function Field({
  label,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  errorId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium leading-none text-ink"
      >
        {label}
      </label>
      {children}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

function FieldError({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} role="alert" className={cn("text-[13px] text-destructive", className)}>
      {children}
    </p>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}
