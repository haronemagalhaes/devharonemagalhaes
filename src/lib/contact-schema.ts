import { z } from "zod";

export const GOALS = [
  { value: "google", label: "Aparecer no Google" },
  { value: "site", label: "Site ou landing page" },
  { value: "sistema", label: "Sistema pra organizar a operação" },
  { value: "automatizar", label: "Automatizar tarefa manual" },
] as const;

/*
 * Mensagens de erro dizem o que fazer, não que está errado:
 * "Digite um WhatsApp com DDD", nunca "Campo inválido".
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Digite seu nome — só o primeiro já serve."),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Digite um WhatsApp com DDD — ex.: (79) 9 9999-9999.")
    .max(20, "Confira o número: está com dígitos demais.")
    .regex(/^[\d\s()+-]+$/, "Use só números, espaços, parênteses ou hífen."),
  business: z
    .string()
    .trim()
    .min(2, "Diga o tipo do seu negócio — ex.: clínica, loja, escritório.")
    .max(120, "Resuma em poucas palavras o tipo do negócio."),
  goals: z
    .array(z.enum(GOALS.map((g) => g.value) as [string, ...string[]]))
    .min(1, "Marque pelo menos uma das opções acima."),
  /** honeypot (nome que o FormSubmit reconhece) — humano deixa vazio */
  _honey: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function labelFor<T extends readonly { value: string; label: string }[]>(
  list: T,
  value: string,
) {
  return list.find((i) => i.value === value)?.label ?? value;
}
