import { NextResponse } from "next/server";
import { BUDGETS, GOALS, contactSchema, labelFor } from "@/lib/contact-schema";
import { EMAIL } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Recebe o formulário "Vamos conversar".
 *
 * Envio de e-mail via Resend (REST, sem SDK) quando `RESEND_API_KEY` existir.
 * Variáveis:
 *   RESEND_API_KEY   — chave da conta Resend
 *   CONTACT_TO       — destino (padrão: EMAIL de src/lib/site.ts)
 *   CONTACT_FROM     — remetente verificado no Resend (ex.: "Site <site@haronedev.com.br>")
 *
 * TODO (PENDÊNCIA): configurar as variáveis acima na Vercel. Sem elas, a rota
 * responde `delivered: false` e o cliente oferece o fallback por WhatsApp.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Dados inválidos", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;

  // honeypot preenchido → finge sucesso e descarta
  if (data.website) return NextResponse.json({ ok: true, delivered: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? EMAIL;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !from) {
    console.warn("[contact] RESEND_API_KEY/CONTACT_FROM ausentes — lead não enviado por e-mail:", {
      name: data.name,
      whatsapp: data.whatsapp,
      business: data.business,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const goals = data.goals.map((g) => labelFor(GOALS, g)).join(", ");
  const budget = labelFor(BUDGETS, data.budget);
  const text = [
    `Nome: ${data.name}`,
    `WhatsApp: ${data.whatsapp}`,
    `Tipo de negócio: ${data.business}`,
    `Quer resolver: ${goals}`,
    `Investimento previsto: ${budget}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Novo contato pelo site — ${data.name}`,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend respondeu", res.status, await res.text());
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] falha ao enviar", err);
    return NextResponse.json({ ok: true, delivered: false });
  }
}
