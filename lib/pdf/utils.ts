/**
 * Trigger a file download from a Uint8Array or Blob in the browser.
 */
export function downloadBlob(
  data: Uint8Array | Blob,
  filename: string,
  mimeType = "application/pdf"
) {
  const blob =
    data instanceof Blob
      ? data
      : new Blob([data.buffer as ArrayBuffer], { type: mimeType });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Human-readable file size string.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Calculate how much smaller the output is vs input, as a percentage.
 * Returns a string like "42% smaller" or "+5% larger".
 */
export function sizeDiff(originalBytes: number, newBytes: number): string {
  if (originalBytes === 0) return "—";
  const diff = ((newBytes - originalBytes) / originalBytes) * 100;
  if (diff < 0) return `${Math.abs(diff).toFixed(1)}% smaller`;
  return `+${diff.toFixed(1)}% larger`;
}
