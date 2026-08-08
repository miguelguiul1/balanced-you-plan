import jsPDF from "jspdf";

/** Identidade visual Evolua Plus aplicada aos PDFs */
const GREEN: [number, number, number] = [45, 106, 79];
const GOLD: [number, number, number] = [212, 160, 60];
const INK: [number, number, number] = [30, 41, 38];
const MUTED: [number, number, number] = [120, 130, 126];

export type PdfSection = {
  title: string;
  lines: string[];
};

type Options = {
  title: string;
  subtitle?: string;
  sections: PdfSection[];
  fileName: string;
};

export const exportBrandedPdf = ({ title, subtitle, sections, fileName }: Options) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = 0;

  const header = () => {
    doc.setFillColor(...GREEN);
    doc.rect(0, 0, pageW, 86, "F");
    doc.setFillColor(...GOLD);
    doc.rect(0, 86, pageW, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Evolua Plus", margin, 44);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Saúde e nutrição inteligente", margin, 62);
    y = 128;
  };

  const footer = () => {
    doc.setTextColor(...MUTED);
    doc.setFontSize(8);
    doc.text(
      `Gerado em ${new Date().toLocaleDateString("pt-BR")} · evoluaplus.app · conteúdo educativo, não substitui acompanhamento profissional`,
      margin,
      pageH - 24
    );
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 56) {
      footer();
      doc.addPage();
      header();
    }
  };

  header();

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, margin, y);
  y += 20;

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...MUTED);
    doc.text(subtitle, margin, y);
    y += 22;
  }

  sections.forEach((section) => {
    ensureSpace(48);
    y += 12;
    doc.setFillColor(...GREEN);
    doc.circle(margin + 3, y - 4, 3, "F");
    doc.setTextColor(...GREEN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(section.title, margin + 14, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    section.lines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, pageW - margin * 2 - 14);
      wrapped.forEach((w: string) => {
        ensureSpace(16);
        doc.text(w, margin + 14, y);
        y += 14;
      });
    });
  });

  footer();
  doc.save(fileName);
};