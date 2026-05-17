export type ImageQuality = "standard" | "high" | "max";

// Scale factor — higher = bigger image, more detail, larger file
const SCALE: Record<ImageQuality, number> = {
  standard: 1.5,  // ~108 DPI
  high:     2.0,  // ~144 DPI
  max:      3.0,  // ~216 DPI
};

const JPEG_QUALITY: Record<ImageQuality, number> = {
  standard: 0.88,
  high:     0.92,
  max:      0.96,
};

export interface PageImage {
  blob: Blob;
  pageNum: number;
  width: number;
  height: number;
}

/**
 * Render every page of a PDF file to a JPEG Blob.
 * Uses pdfjs-dist loaded dynamically (browser-only, no SSR issues).
 */
export async function pdfToImages(
  file: File,
  quality: ImageQuality,
  onProgress?: (current: number, total: number) => void
): Promise<PageImage[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const bytes = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib
    .getDocument({ data: new Uint8Array(bytes) })
    .promise;

  const scale = SCALE[quality];
  const jpegQ = JPEG_QUALITY[quality];
  const results: PageImage[] = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    onProgress?.(i, pdfDoc.numPages);

    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not available.");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error(`Page ${i}: canvas export failed`))),
        "image/jpeg",
        jpegQ
      )
    );

    results.push({ blob, pageNum: i, width: canvas.width, height: canvas.height });

    // Release memory immediately
    canvas.width = 0;
    canvas.height = 0;
  }

  return results;
}

/**
 * Package multiple Blobs into a ZIP file using JSZip.
 * Returns a Blob of the .zip archive.
 */
export async function zipImages(
  images: PageImage[],
  baseName: string
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const folder = zip.folder(baseName) ?? zip;

  for (const img of images) {
    folder.file(`page-${String(img.pageNum).padStart(3, "0")}.jpg`, img.blob);
  }

  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
