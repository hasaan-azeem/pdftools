import { PDFDocument } from "pdf-lib";

export type PageSize = "original" | "a4" | "letter";
export type Margin = "none" | "small" | "large";

// Points (1 point = 1/72 inch)
const PAGE_DIMS: Record<"a4" | "letter", [number, number]> = {
  a4:     [595.28, 841.89],
  letter: [612,    792],
};

const MARGIN_PT: Record<Margin, number> = {
  none:  0,
  small: 20,
  large: 40,
};

/**
 * Embed an array of image files (JPEG, PNG, WebP*) into a single PDF.
 * *WebP is embedded as PNG after canvas conversion.
 */
export async function imagesToPDF(
  files: File[],
  pageSize: PageSize,
  margin: Margin
): Promise<Uint8Array> {
  if (files.length === 0) throw new Error("Select at least one image.");

  const pdf = await PDFDocument.create();
  const m = MARGIN_PT[margin];

  for (const file of files) {
    let bytes = await file.arrayBuffer();

    // WebP / unsupported types: draw to canvas and export as PNG first
    if (
      !["image/jpeg", "image/jpg", "image/png"].includes(file.type.toLowerCase())
    ) {
      const blob = await canvasConvertToPng(file);
      bytes = await blob.arrayBuffer();
    }

    let img;
    try {
      const mimeHint = file.type.toLowerCase().includes("png") ? "png" : "jpg";
      img =
        mimeHint === "png"
          ? await pdf.embedPng(bytes)
          : await pdf.embedJpg(bytes);
    } catch {
      // Fallback: try png then jpg
      try { img = await pdf.embedPng(bytes); }
      catch { img = await pdf.embedJpg(bytes); }
    }

    const { width: iW, height: iH } = img.scale(1);

    let pageW: number, pageH: number;
    if (pageSize === "original") {
      pageW = iW;
      pageH = iH;
    } else {
      [pageW, pageH] = PAGE_DIMS[pageSize];
    }

    const page = pdf.addPage([pageW, pageH]);

    // Scale image to fill the page minus margins
    const availW = pageW - m * 2;
    const availH = pageH - m * 2;
    const ratio = Math.min(availW / iW, availH / iH);
    const dW = iW * ratio;
    const dH = iH * ratio;
    const x = (pageW - dW) / 2;
    const y = (pageH - dH) / 2;

    page.drawImage(img, { x, y, width: dW, height: dH });
  }

  return pdf.save();
}

/** Use an offscreen canvas to convert any image format to PNG bytes. */
async function canvasConvertToPng(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Canvas conversion failed"))),
        "image/png"
      );
    };
    img.onerror = () => reject(new Error(`Cannot load image: ${file.name}`));
    img.src = URL.createObjectURL(file);
  });
}
