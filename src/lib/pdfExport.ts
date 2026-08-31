import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { buildPdf, exportBrandedPdf, type Options } from "./pdf";

/**
 * Exporta o PDF do Evolua Plus em qualquer plataforma:
 * - Web: mantém o comportamento original (download via jsPDF).
 * - Android/iOS (Capacitor): grava no cache do app e abre a folha de
 *   compartilhamento nativa, já que download de blob não funciona no WebView.
 */
export const exportPdfCompat = async ({ title, subtitle, sections, fileName }: Options): Promise<void> => {
  if (Capacitor.isNativePlatform()) {
    const doc = buildPdf({ title, subtitle, sections });
    const dataUrl = doc.output("datauristring");
    const base64 = dataUrl.split(",")[1];
    if (!base64) throw new Error("Não foi possível gerar o PDF");
    const saved = await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Cache,
      recursive: true,
    });
    await Share.share({ title, url: saved.uri });
    return;
  }
  exportBrandedPdf({ title, subtitle, sections, fileName });
};