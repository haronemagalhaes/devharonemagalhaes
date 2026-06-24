import LogoMarca from "@/assets/Logomarca.png";
import { SITE_URL, SUPPORT_POLICY, type Quote } from "./budget-types";

// Paleta do PDF — PRETO E BRANCO minimalista, fiel à logomarca HM.
// (Sem azul/cyan: o acento da marca não é usado neste documento.)
const BLACK: [number, number, number] = [10, 10, 10]; // #0a0a0a — título, barras, caixa do total
const INK: [number, number, number] = [26, 26, 26]; // corpo dos itens (legível sobre branco)
const MUTED: [number, number, number] = [68, 68, 68]; // #444 — data e textos auxiliares
const GRAY_FILL: [number, number, number] = [242, 242, 242]; // #f2f2f2 — fundo das barras de seção

/** Carrega uma imagem (asset same-origin) como dataURL + dimensões naturais. */
async function loadImage(
  src: string
): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("logo load error"));
      img.src = src;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return { data: canvas.toDataURL("image/png"), w: img.naturalWidth, h: img.naturalHeight };
  } catch {
    return null;
  }
}

function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "cliente"
  );
}

/** Gera e baixa o PDF do orçamento. jsPDF é carregado sob demanda. */
export async function generateBudgetPdf(quote: Quote): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const M = 15;
  const contentW = PAGE_W - M * 2;
  let y = M;

  const ensure = (h: number) => {
    if (y + h > PAGE_H - M) {
      doc.addPage();
      y = M;
    }
  };

  // ===== Cabeçalho: logo (maior) + título + data =====
  const logo = await loadImage(LogoMarca.src);
  let titleX = M;
  let logoH = 0;
  if (logo) {
    const w = 30; // logomarca bem maior e visível
    logoH = Math.min(w * (logo.h / logo.w), 26);
    doc.addImage(logo.data, "PNG", M, y, w, logoH);
    titleX = M + w + 8;
  }
  // Título centralizado verticalmente em relação à logo.
  const headerH = Math.max(logoH, 12);
  const baseline = y + headerH / 2 + 2.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(...BLACK);
  doc.text("Orçamento — HaroneDev", titleX, baseline);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(quote.date, PAGE_W - M, baseline, { align: "right" });

  y += headerH + 6;
  doc.setFillColor(...BLACK);
  doc.rect(M, y, contentW, 1.2, "F");
  y += 9;

  // ===== Dados do cliente =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("Cliente", M, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nome: ${quote.name}`, M, y);
  y += 5;
  doc.text(`Telefone: ${quote.phone}`, M, y);
  y += 10;

  // ===== Helpers de bloco =====
  const sectionBar = (label: string) => {
    ensure(14);
    doc.setFillColor(...GRAY_FILL);
    doc.rect(M, y, contentW, 8, "F");
    doc.setFillColor(...BLACK);
    doc.rect(M, y, 1.5, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);
    doc.text(label, M + 4, y + 5.5);
    y += 12;
  };

  const list = (title: string, items: string[]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    ensure(6);
    doc.text(title, M + 2, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    items.forEach((it) => {
      const lines = doc.splitTextToSize(`•  ${it}`, contentW - 6) as string[];
      ensure(lines.length * 4.6);
      doc.text(lines, M + 4, y);
      y += lines.length * 4.6;
    });
    y += 2;
  };

  const paragraph = (title: string, text: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    ensure(6);
    doc.text(title, M + 2, y);
    y += 5;
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(text, contentW - 4) as string[];
    ensure(lines.length * 4.6);
    doc.text(lines, M + 4, y);
    y += lines.length * 4.6 + 2;
  };

  // ===== Serviços (cada um com seu próprio plano) =====
  quote.services.forEach((s) => {
    sectionBar(s.name + (s.custom ? "  (sob consulta)" : ""));
    if (s.included.length) list("Inclusos no pacote:", s.included);
    if (s.extras.length) list("Extras escolhidos:", s.extras);
    if (s.domain) {
      // Texto exato (já contém "Domínio..."), renderizado como linha própria.
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      const dlines = doc.splitTextToSize(s.domain, contentW - 4) as string[];
      ensure(dlines.length * 4.6);
      doc.text(dlines, M + 2, y);
      y += dlines.length * 4.6 + 2;
    }
    if (s.freeText) paragraph("Observação:", s.freeText);
    if (s.notice) paragraph("Importante:", s.notice);
    if (s.plan) paragraph("Plano mensal:", s.plan);
    y += 2;
  });

  // ===== Total =====
  ensure(26);
  y += 2;
  doc.setFillColor(...BLACK);
  doc.roundedRect(M, y, contentW, 16, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Estimativa inicial", M + 5, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(quote.totalLabel, M + 5, y + 12.5);
  y += 20;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  {
    const lines = doc.splitTextToSize(
      "O valor final pode variar conforme os itens extras selecionados. Confirmamos na conversa.",
      contentW
    ) as string[];
    doc.text(lines, M, y);
    y += lines.length * 4.2 + 4;
  }

  // ===== Política de suporte =====
  sectionBar("Política de suporte");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  SUPPORT_POLICY.forEach((it) => {
    const lines = doc.splitTextToSize(`•  ${it}`, contentW - 6) as string[];
    ensure(lines.length * 4.2);
    doc.text(lines, M + 4, y);
    y += lines.length * 4.2;
  });

  // ===== Formas de pagamento (texto simples, sem logos) =====
  y += 3;
  {
    const lines = doc.splitTextToSize(
      "Formas de pagamento: cartão, Pix, boleto e principais bandeiras.",
      contentW
    ) as string[];
    ensure(lines.length * 4.2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(lines, M, y);
    y += lines.length * 4.2;
  }

  // ===== Rodapé (em todas as páginas) =====
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.3);
    doc.line(M, PAGE_H - 14, PAGE_W - M, PAGE_H - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(SITE_URL, M, PAGE_H - 9);
    doc.text(quote.date, PAGE_W - M, PAGE_H - 9, { align: "right" });
    doc.text(
      `${p}/${pageCount}`,
      PAGE_W / 2,
      PAGE_H - 9,
      { align: "center" }
    );
  }

  doc.save(`orcamento-haronedev-${slugify(quote.name)}.pdf`);
}
