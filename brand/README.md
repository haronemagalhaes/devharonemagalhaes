# brand/

Sistema oficial da marca **Harone Magalhães — Estúdio de tecnologia e presença digital**.

## Fonte da verdade

**`brand/manual/BRAND-BOOK.md`**

Leia antes de criar qualquer peça, página, post, proposta ou animação da marca. Se algo aqui discordar dele, o manual vence. Se o manual discordar de uma decisão mais recente do Harone, o manual está desatualizado e precisa ser corrigido.

Cada regra do manual tem um status: `DEFINIDO`, `EM USO`, `LEGADO`, `AINDA NÃO DEFINIDO` ou `RECOMENDAÇÃO`. Só as duas primeiras são regra.

## Estrutura

```
brand/
├── README.md                          este arquivo
├── manual/
│   ├── BRAND-BOOK.md                  manual completo (fonte da verdade)
│   └── brand-book.html                edição visual, gerada a partir do .md
├── logo/
│   ├── simbolo-hm.png                 monograma HM, transparente
│   ├── logo-original.png              símbolo + nome (o favicon)
│   └── assinatura-*.png               com descritor: horizontal e empilhada,
│                                      preto e branco, com e sem fundo
├── tokens/
│   ├── tokens.json                    cores, fontes, espaçamento, raio, movimento
│   └── tokens.css                     os mesmos tokens em CSS, para uso fora do site
├── social/
│   ├── modelo-base.html               modelo de arte (feed e story) no sistema aprovado
│   ├── exemplos/                      peças aprovadas, em tamanho reduzido
│   └── stories/                       sistema de Stories: STORIES.md, stories.css,
│                                      13 modelos STORY_* (.html + png/), guia de área segura
└── templates/
    └── instrucoes-projeto-orcamentos.md   instruções do projeto de propostas
```

## Uso rápido

- **Designer:** manual, seção 22.
- **IA:** manual, seção 21. Cole o bloco de instruções antes do pedido.
- **Desenvolvedor:** manual, seção 23. No site, os tokens estão em `src/app/globals.css`.

## Regras que não mudam sem autorização

- Monocromático. Nenhuma cor de destaque.
- O monograma HM não é redesenhado.
- Nada de cor, logo ou fonte de cliente na marca do estúdio.
