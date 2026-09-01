import { z } from "zod";

export const GOALS = [
  { value: "ser-achado", label: "Ser achado na internet" },
  { value: "organizar-operacao", label: "Organizar a operação num sistema" },
  { value: "automatizar", label: "Automatizar tarefas" },
  { value: "anuncios", label: "Anúncios que tragam cliente" },
] as const;

export const BUDGETS = [
  { value: "ate-5k", label: "Até R$ 5 mil" },
  { value: "5k-15k", label: "R$ 5 a 15 mil" },
  { value: "15k-40k", label: "R$ 15 a 40 mil" },
  { value: "acima-40k", label: "Acima de R$ 40 mil" },
  { value: "nao-sei", label: "Ainda não sei" },
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Me diz seu nome."),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Coloca o número com DDD.")
    .max(20, "Número muito longo.")
    .regex(/^[\d\s()+-]+$/, "Só números, por favor."),
  business: z.string().trim().min(2, "Que tipo de negócio é o seu?").max(120),
  goals: z
    .array(z.enum(GOALS.map((g) => g.value) as [string, ...string[]]))
    .min(1, "Marca pelo menos uma opção."),
  budget: z.enum(BUDGETS.map((b) => b.value) as [string, ...string[]], {
    message: "Escolhe uma faixa.",
  }),
  /** honeypot — deve ficar vazio */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function labelFor<T extends readonly { value: string; label: string }[]>(
  list: T,
  value: string,
) {
  return list.find((i) => i.value === value)?.label ?? value;
}
