import { z } from "zod";

export const GOALS = [
  { value: "ser-achado", label: "Ser achado na internet" },
  { value: "organizar-operacao", label: "Organizar a operação num sistema" },
  { value: "automatizar", label: "Automatizar tarefas" },
  { value: "anuncios", label: "Anúncios que tragam cliente" },
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
