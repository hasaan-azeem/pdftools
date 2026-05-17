import { PDFDocument } from "pdf-lib";

/**
 * Load a PDF file and return its page count.
 * Throws a user-friendly error if the file is invalid.
 */
export async function getPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  try {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch {
    throw new Error(`"${file.name}" is not a valid PDF.`);
  }
}

/**
 * Merge an ordered array of PDF files into a single PDF.
 * Returns the merged PDF as a Uint8Array ready for download.
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Add at least 2 PDF files to merge.");
  }

  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    let src: PDFDocument;

    try {
      src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    } catch {
      throw new Error(
        `"${file.name}" could not be read. Make sure it is a valid PDF.`
      );
    }

    const indices = src.getPageIndices();
    const copied = await merged.copyPages(src, indices);
    copied.forEach((p) => merged.addPage(p));
  }

  // Save without object streams for maximum compatibility
  return merged.save({ useObjectStreams: false });
}
