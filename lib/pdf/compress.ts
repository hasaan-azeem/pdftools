import { PDFDocument } from "pdf-lib";

export type CompressionLevel = "basic" | "extreme";

export interface CompressResult {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
}

/**
 * BASIC mode: Uses pdf-lib object streams to remove redundant cross-reference
 * data and strip document metadata. Works on all PDFs.
 *
 * EXTREME mode: Renders every page to a canvas (via pdfjs-dist), re-encodes
 * as JPEG, and rebuilds the PDF from those images. This achieves real
 * compression on image-heavy PDFs but rasterizes text (text is no longer
 * selectable after this mode).
 */
export async function compressPDF(
  file: File,
  level: CompressionLevel,
  onProgress?: (current: number, total: number) => void
): Promise<CompressResult> {
  const originalBytes = await file.arrayBuffer();
  const originalSize = originalBytes.byteLength;

  if (level === "basic") {
    const doc = await PDFDocument.load(originalBytes);

    // Strip metadata to reduce size
    doc.setTitle("");
    doc.setAuthor("");
    doc.setSubject("");
    doc.setKeywords([]);
    doc.setProducer("PDFTools");
    doc.setCreator("PDFTools");

    const data = await doc.save({ useObjectStreams: true, addDefaultPage: false });
    return { data, originalSize, compressedSize: data.byteLength };
  }

  // EXTREME: rasterize pages via pdfjs, re-encode as JPEG, rebuild PDF
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const pdfDoc = await pdfjsLib
    .getDocument({ data: new Uint8Array(originalBytes) })
    .promise;

  const newPdf = await PDFDocument.create();
  const total = pdfDoc.numPages;

  for (let i = 1; i <= total; i++) {
    onProgress?.(i, total);

    const page = await pdfDoc.getPage(i);
    // Scale 1.0 keeps approximate original resolution; lower = smaller file
    const viewport = page.getViewport({ scale: 1.2 });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported in this browser.");

    await page.render({ canvasContext: ctx, viewport }).promise;

    // Re-encode as JPEG at 75% quality — the main source of compression
    const jpegBlob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob(
        (b) => (b ? res(b) : rej(new Error("Canvas encoding failed"))),
        "image/jpeg",
        0.75
      )
    );

    const jpegBytes = await jpegBlob.arrayBuffer();
    const img = await newPdf.embedJpg(jpegBytes);
    const newPage = newPdf.addPage([viewport.width, viewport.height]);
    newPage.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });

    // Free canvas memory
    canvas.width = 0;
    canvas.height = 0;
  }

  const data = await newPdf.save({ useObjectStreams: true });
  return { data, originalSize, compressedSize: data.byteLength };
}
