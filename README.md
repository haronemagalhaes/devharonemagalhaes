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
- `src/app/home/contact-form.tsx` — formulário "Vamos conversar"; envia direto do client pelo FormSubmit.co (sem backend).
- `src/app/globals.css` — tokens da marca (`--bg`, `--ink`, `--line`…), utilitários e animações do hero.
- `src/components/site/*` — lockup, botões, eyebrow, arcos, marcas de canto.
- `src/components/motion/*` — reveal, rule, count-up, smooth scroll.
- `src/lib/site.ts` — constantes (contato, CTA, nav, números da faixa de prova).

## Formulário (FormSubmit.co)

Sem variáveis de ambiente: o `onSubmit` faz `POST https://formsubmit.co/ajax/<destino>` com JSON (`_template: table`, `_captcha: false`, honeypot `_honey`).

- 1º envio real → o FormSubmit manda um e-mail de ativação para o destino; clicar no link (antes disso nada chega e o site mostra o toast de erro).
- Depois de ativar, trocar o destino em `FORMSUBMIT_ENDPOINT` (`contact-form.tsx`) pelo hash que o FormSubmit fornece, para o e-mail não ficar no JS.
