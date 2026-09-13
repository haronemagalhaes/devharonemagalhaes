# Stories — sistema oficial

Versão 1.0 · 11/09/2026 · marca Harone Magalhães

Este sistema é uma **extensão do manual** (`brand/manual/BRAND-BOOK.md`, seção 13). Ele não cria identidade nova. Tudo aqui sai da paleta, da tipografia e das peças aprovadas em 07 e 08/09/2026.

**Regra do sistema:** variar o layout, nunca a marca.

---

## 1. O que nunca varia

| Constante | Valor |
|---|---|
| Formato | 1080 × 1920 |
| Moldura | Crumb no topo (`haronedev_` à esquerda, tema à direita) → conteúdo → régua de 1 px → rodapé (`quem fecha o escopo é quem executa` · `haronedev.com.br`) |
| Margem lateral | 92 px |
| Fontes | Archivo nos títulos e textos · Geist Mono em rótulos, crumb, rodapé e dados |
| Cores | Papel `#F6F5F1`, tinta `#131310`, tinta 2 `#6E6C63`, tinta 3 `#9E9C91`, linha `#E3E1D9`; noir `#141310` / `#F4F3EF` / `#B8B5A9` / `#7E7B70` / `#2C2A23` |
| Headline | Dois tons no máximo: uma linha em tinta, outra em tinta 3 |
| Textura | Grão `soft-light` 45% (60% no noir) e luz no canto superior esquerdo |
| Símbolo | Arquivo oficial `brand/logo/simbolo-hm.png`, nunca redesenhado |
| CTA | Um rótulo só: **Começar meu projeto →** |

## 2. O que pode variar

- Composição e alinhamento.
- Fundo: papel, papel com bloco de tinta, ou tinta inteira (ver 4).
- Escala tipográfica, do display de 300 px ao título de 66 px.
- Tamanho e posição da imagem.
- Quantidade de elementos.
- Estrutura do bloco: lista com fio, cartão, bloco de tinta.

## 3. Área segura

Guia visual em `png/00_GUIA_AREA_SEGURA.png`.

| Zona | Faixa (y) | O que vai ali |
|---|---|---|
| Interface do Instagram | 0–212 | Nada |
| Crumb | 212 | Rótulo não essencial |
| **Conteúdo essencial** | **300–1600** | Tudo que precisa ser lido |
| Régua e rodapé | ≈1690 | Não essencial |
| Resposta e reações | 1720–1920 | Nada |

A grade tem 6 colunas de 129 px, com 24 px entre elas, dentro das margens de 92 px.

## 4. Fundos e blocos

**Cor secundária não existe.** A marca é monocromática por decisão (manual, seção 08). A variação de fundo vem da tinta.

| Fundo | Quando usar | Modelos |
|---|---|---|
| **Papel** | Padrão. A maioria dos stories | 01, 02, 04, 05, 06, 07, 08, 10, 13 |
| **Papel + bloco de tinta** | Quando existe uma ação ou condição que precisa se separar do resto: oferta, contato, novidade | 03, 11, 12 |
| **Tinta inteira** | Só frase ou manifesto. No máximo 1 a cada 5 stories de uma sequência | 09 |

> **Atenção.** Em 08/09/2026 você reprovou o fundo preto nas séries de identidade. O fundo de tinta inteira ficou restrito ao manifesto (09) e está marcado como `A APROVAR`. Se reprovar, o 09 passa a ser feito em papel, com o mesmo texto.

**Regras do bloco:**
- Retângulo de tinta sangrado até a borda, sem raio, sem sombra.
- Função sempre declarada: separar ação, condição ou novidade.
- Nunca decoração, nunca faixa diagonal ou cunha.
- Texto sobre o bloco usa as cores do noir.

## 5. Escala tipográfica (story)

| Papel | Fonte | Tamanho | Altura de linha | Espaçamento | Cor |
|---|---|---|---|---|---|
| Display (número) | Archivo 700 | 300 px | 0,86 | −0,06em | Tinta |
| Headline grande | Archivo 700 | 116–124 px | 1,04 | −0,045em | Tinta / tinta 3 |
| Headline | Archivo 700 | 96 px | 1,06 | −0,04em | Tinta / tinta 3 |
| Título | Archivo 700 | 66–70 px | 1,08 | −0,035em | Tinta |
| Item de lista | Archivo 600 | 40–42 px | 1,18 | −0,02em | Tinta |
| Subtítulo e corpo | Archivo 400 | 30 px | 1,45 | 0 | Tinta 2 |
| CTA | Archivo 600 | 36 px | 1 | −0,015em | Papel sobre tinta |
| Rótulo | Geist Mono 400 | 18 px, caixa alta | — | 0,24em | Tinta 2 |
| Legenda e dado | Geist Mono 400 | 20 px | 1,5 | 0,04em | Tinta 2 |
| Crumb e rodapé | Geist Mono 400 | 16 px | — | 0,18 / 0,05em | Tinta 3 |

**Legibilidade no celular.** Um story de 1080 px aparece com cerca de 390 pt de largura, ou seja, a 36%.
- O corpo de 30 px chega a cerca de 11 pt. É o mínimo para texto que precisa ser lido.
- Rótulo, crumb e rodapé ficam menores e só carregam informação não essencial.
- Em relação às peças aprovadas, subi o subtítulo de 26 para 30 px e o rótulo de 16 para 18 px, para ler melhor no celular. A identidade não muda.

**Contraste.** A tinta 3 (`#9E9C91`) só aparece em headline de 96 px ou mais e em rodapé. Texto que precisa ser lido usa tinta 2, que dá 4,8:1. Ver P04 no manual.

## 6. Imagem

| Tipo | Tratamento |
|---|---|
| Fundador | Preto e branco (`grayscale`), recorte vertical, marcas de canto só nos lados que não sangram |
| Bastidores | Print real em preto e branco, sangrando pela borda direita, com borda de 1 px e sombra suave |
| Portfólio | **Print real em cores**, porque é prova. Moldura com as quatro marcas de canto. A identidade do cliente fica dentro do print e nunca vai para a moldura |
| Banco de imagem, 3D, mockup falso, pessoa aleatória | Nunca |

O preto e branco nas fotos vem do tratamento `img-duotone` que o site já usa nos projetos. A foto do fundador em preto e branco é uma variação nova, marcada como `A APROVAR`.

## 7. Ícones

O sistema não usa ícones. O único sinal gráfico é a seta `→` (e `↓` na enquete) em Geist Mono. Estrelas (★) só no depoimento, em tinta, como no site.

## 8. Catálogo

| # | Modelo | Categoria | Fundo | Estrutura |
|---|---|---|---|---|
| 01 | `STORY_INSTITUTIONAL` | Institucional | Papel | Foto do fundador sangrando à direita → descritor → título → subtítulo |
| 02 | `STORY_SERVICE` | Serviços | Papel | Serviço → headline de dois tons → 3 itens com fio → CTA |
| 03 | `STORY_OFFER` | Comercial | Papel + bloco | Headline grande em papel → condição e CTA no bloco de tinta |
| 04 | `STORY_EDUCATIONAL` | Educativo | Papel | Headline → lista numerada grande → fecho |
| 05 | `STORY_NUMBERS` | Autoridade | Papel | Número de 300 px → segundo número → setores → frase |
| 06 | `STORY_TESTIMONIAL` | Prova social | Papel | Aspas → citação real → estrelas → quem falou |
| 07 | `STORY_BTS` | Bastidores | Papel | Headline → print sangrando → legenda |
| 08 | `STORY_PORTFOLIO` | Portfólio | Papel | Setor → print em moldura → nome do projeto → o que foi feito |
| 09 | `STORY_MANIFESTO` | Frase / manifesto | Tinta | Símbolo → frase em dois tons, 124 px |
| 10 | `STORY_POLL` | Enquete / interação | Papel | Pergunta no alto → zona livre de 1000 a 1480 para a figurinha |
| 11 | `STORY_CTA` | CTA | Papel + bloco | Pergunta → WhatsApp e site no bloco → CTA |
| 12 | `STORY_LAUNCH` | Lançamento | Bloco + papel | Bloco com o HM a 6% → novidade → link |
| 13 | `STORY_AGENDA` | Data / agenda | Papel | Headline → cartões por dia (livre ou cheio) → CTA |
| 14 | `STORY_PROCESS` | Processo / educativo | Papel | **Centralizado** no eixo 540: rótulo → headline de dois tons → 4 passos ligados por conectores de 2 px |
| 15 | `STORY_FAQ` | Pergunta frequente / objeção | Papel | **Assimétrico**: marcadores P. e R. na coluna 1, todo o texto na borda da coluna 2 (x 245) → pergunta de 100 px → fio → resposta de 64 px → CTA |
| 16 | `STORY_THIS_OR_THAT` | Interação: isso ou aquilo | Papel + bloco | **Tela dividida centralizada**: pergunta → palavra de 210 px em papel / palavra de 210 px no bloco de tinta. Figurinha de enquete na costura (y 940–1060) |
| 17 | `STORY_STATEMENT` | Frase / opinião | Papel | **Ancorado embaixo**: topo vazio de propósito, duas linhas em tinta 3 → uma linha de 184 px em tinta → subtítulo |
| 18 | `STORY_CHECKLIST` | Educativo: teste rápido | Papel | Headline → 5 itens com caixa de 44 px centrada na linha do texto → fecho com o diagnóstico gratuito |
| 20 | `STORY_BRAND_INTRO` | Apresentação da marca | Papel | **Centralizado**: assinatura empilhada oficial a 740 px dentro de marcas de canto nas margens → frase da marca em dois tons → as quatro frentes em mono |
| 19 | `STORY_PRODUCT` | Produto (SI-Agenda) | Papel | Headline → grade 2×3 de cartões presa às colunas 1–3 e 4–6 (436 + 24 + 436) → frase → CTA |

**Arquivos:**
- `NN_STORY_*.html`: fonte editável de cada modelo.
- `png/NN_STORY_*.png`: render em 1080 × 1920.
- `stories.css`: o sistema compartilhado.
- `prancha.png`: todos os modelos lado a lado.

**Conteúdo de exemplo que precisa ser trocado antes de publicar:**
- 12: a novidade.
- 13: datas e horários.
- 07: o assunto da semana.

O resto é conteúdo real: textos do site, depoimento recebido em 01/09/2026 e números 40+ e 9+.

## 9. Sequências

Quando o pedido for uma sequência, cada story é uma etapa da mesma narrativa. Nunca uma arte isolada.

| Etapa | Função | Modelo indicado |
|---|---|---|
| 1 · Gancho | Parar o dedo | 09 Manifesto, 04 Educativo ou 10 Enquete |
| 2 · Contexto | Nomear o problema | 04 Educativo |
| 3 · Informação | Mostrar a saída | 02 Serviço ou 07 Bastidores |
| 4 · Prova | Dar credibilidade | 05 Números, 06 Depoimento ou 08 Portfólio |
| 5 · CTA | Levar à conversa | 11 CTA ou 03 Oferta |

Regras de sequência:
- O crumb da direita vira contador (`01 / 05`).
- Todas as peças usam o mesmo rótulo de tema.
- No máximo um fundo de tinta inteira e um bloco de tinta por sequência.
- O CTA fica só na última peça.

## 10. Como criar um story novo

1. Ler o manual e este arquivo.
2. Identificar a categoria e o objetivo: o que a pessoa deve fazer depois de ver.
3. Partir do modelo mais próximo e duplicar o `.html`.
4. Trocar só o conteúdo e a composição. Nunca `stories.css` sem aprovação.
5. Cortar o texto até caber na área de 300 a 1600 com folga. Se não couber, dividir em dois stories.
6. Renderizar: Chrome headless `--window-size=1080,1920 --force-device-scale-factor=2`, depois `sips -z 1920 1080`.
7. Revisar hierarquia, contraste, área segura, dois tons, palavras proibidas e números reais.
8. Se não existir modelo: criar uma variação a partir das peças deste sistema, sem nova cor, fonte ou ícone. Quando você aprovar, ela entra no catálogo com o próximo número e nome `STORY_*`.

## 11. Precisão: alinhamento e centralização

**Escolha um sistema de alinhamento por story:** à esquerda (padrão da marca), centralizado ou assimétrico. Não misture sem motivo.

A moldura (crumb e rodapé, de ponta a ponta nas margens de 92 px) é simétrica e funciona com os três.

**Centralizado:**
- Eixo em x = 540.
- O container é centralizado (`align-items: center`) e o texto também (`text-align: center`).
- O bloco de várias linhas é tratado como uma unidade.

**Correções ópticas obrigatórias:**

| Caso | Problema | Correção |
|---|---|---|
| Texto com `letter-spacing` (rótulo, número mono) | O navegador deixa um espaço depois da última letra, e o texto sai 2 a 4 px para a esquerda | `padding-left` igual ao `letter-spacing` |
| Headline que termina em ponto | O ponto tem pouca massa, e o centro visual cai para a esquerda | Ponto em `<span>` com `margin-right: -.22em` |
| Linha da headline | O navegador pode quebrar sozinho e deixar uma palavra sozinha na linha | Cada linha num `<span>` com `white-space: nowrap`. A quebra é decisão de design |
| Conector ou fio vertical | 1 px em eixo par cai em meio pixel e borra | 2 px exatos (539–541) |

**Medição.** Depois de renderizar, rode:

```bash
python3 brand/social/stories/tools/measure_axis.py png/ARQUIVO.png
```

O script lista o centro real de cada linha de conteúdo.
- **Tolerância:** ±3 px, diferença que vem do espaço lateral de cada letra.
- **Headline com ponto corrigido:** fica cerca de +12 px à direita na medida, porque o ponto conta no bbox. É o esperado.

**Largura de texto:**
- Headline: até 900 px.
- Subtítulo e corpo: até 760 px quando centralizado, até 840 px à esquerda.

## 12. Histórico

| Data | Evento |
|---|---|
| 11/09/2026 | Sistema criado, 13 modelos. 09 (fundo tinta) e foto do fundador em P&B marcados como `A APROVAR` |
| 12/09/2026 | 14 `STORY_PROCESS`: primeira composição centralizada. Regras de precisão e medidor de eixo adicionados. `A APROVAR` |
| 12/09/2026 | 15 `STORY_FAQ`: primeira composição assimétrica, com grade de 6 colunas e marcadores na linha de base. `A APROVAR` |
| 12/09/2026 | 16 a 19: tela dividida, frase ancorada embaixo, checklist e grade de produto. Correção óptica medida em cada peça: título grande com `margin-left: -.035em`; palavras de 210 px ajustadas pelo desvio medido. `A APROVAR` |
