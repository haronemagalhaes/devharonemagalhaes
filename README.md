# haronedev.com.br

Site do estúdio **Harone Magalhães — Estúdio de tecnologia e presença digital**.
Sites, sistemas, automação e tráfego pago, de Aracaju/SE para todo o Brasil.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind 4 · framer-motion · lenis · react-hook-form + zod.
Fontes Syne (display) e Inter (corpo) via `next/font/google`.

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Estrutura

- `src/app/layout.tsx` — fontes, metadata/SEO, JSON-LD, providers de motion.
- `src/app/page.tsx` — composição da home (ordem das seções).
- `src/app/home/*` — uma seção por arquivo; `projects.ts` é o índice de trabalho.
- `src/app/api/contact/route.ts` — recebe o formulário e envia e-mail via Resend.
- `src/app/globals.css` — tokens da marca (`--bg`, `--ink`, `--line`…), utilitários e animações do hero.
- `src/components/site/*` — lockup, botões, eyebrow, arcos, marcas de canto.
- `src/components/motion/*` — reveal, rule, count-up, smooth scroll.
- `src/lib/site.ts` — constantes (contato, CTA, nav, números da faixa de prova).

## Variáveis de ambiente (formulário)

| Nome | Uso |
|---|---|
| `RESEND_API_KEY` | chave da conta Resend |
| `CONTACT_FROM` | remetente verificado, ex.: `Site <site@haronedev.com.br>` |
| `CONTACT_TO` | destino (opcional; padrão = `EMAIL` em `src/lib/site.ts`) |

Sem essas variáveis o formulário valida e oferece o fallback por WhatsApp com a mensagem pré-preenchida.
