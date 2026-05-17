/**
 * API client for the PDFTools backend (running on Render).
 *
 * Set NEXT_PUBLIC_API_URL in your Vercel environment variables
 * to your Render service URL, e.g.:
 *   https://pdftools-api.onrender.com
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && (window as any).__PDF_API_URL) ||
  "http://localhost:4000";

/** Result returned to the tool UI after a successful API call */
export interface ApiResult {
  blob: Blob;
  filename: string;
  /** Extra metadata from response headers */
  meta: {
    pages?: number;
    originalSize?: number;
    compressedSize?: number;
    reductionPercent?: number;
  };
}

/** Generic error from the API */
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Extract a meaningful error message from a failed response.
 */
async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.error || body.message || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status} — ${res.statusText}`;
  }
}

/**
 * POST multipart/form-data to the given endpoint and return the file blob.
 */
async function postForm(endpoint: string, form: FormData): Promise<ApiResult> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const msg = await parseError(res);
    throw new ApiError(msg, res.status);
  }

  const blob = await res.blob();

  // Parse optional headers
  const pages          = res.headers.get("X-Pages");
  const originalSize   = res.headers.get("X-Original-Size");
  const compressedSize = res.headers.get("X-Compressed-Size");
  const reduction      = res.headers.get("X-Reduction-Percent");
  const disposition    = res.headers.get("Content-Disposition") ?? "";

  // Extract filename from Content-Disposition header
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
  const filename      = filenameMatch?.[1] ?? "download";

  return {
    blob,
    filename,
    meta: {
      pages:            pages          ? parseInt(pages)          : undefined,
      originalSize:     originalSize   ? parseInt(originalSize)   : undefined,
      compressedSize:   compressedSize ? parseInt(compressedSize) : undefined,
      reductionPercent: reduction      ? parseFloat(reduction)    : undefined,
    },
  };
}

// ── Individual tool calls ─────────────────────────────────────────────────────

export async function apiMerge(files: File[]): Promise<ApiResult> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return postForm("/api/merge", form);
}

export async function apiCompress(
  file: File,
  mode: "basic" | "extreme"
): Promise<ApiResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("mode", mode);
  return postForm("/api/compress", form);
}

export async function apiJpgToPdf(
  files: File[],
  pageSize: string,
  margin: string
): Promise<ApiResult> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("pageSize", pageSize);
  form.append("margin", margin);
  return postForm("/api/jpg-to-pdf", form);
}

export async function apiPdfToJpg(
  file: File,
  quality: string
): Promise<ApiResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("quality", quality);
  return postForm("/api/pdf-to-jpg", form);
}

/** Download a Blob by creating a temporary <a> tag */
export function downloadResult(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024)             return `${bytes} B`;
  if (bytes < 1024 * 1024)      return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
