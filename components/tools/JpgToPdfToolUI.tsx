"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, Download, Loader2, CheckCircle, AlertCircle, WifiOff } from "lucide-react";
import { apiJpgToPdf, downloadResult, formatBytes, ApiError } from "@/lib/api";

interface ImgEntry { id: string; file: File; preview: string; }
type Status = "idle" | "uploading" | "done" | "error";

const PAGE_SIZES = [
  { id: "a4",       label: "A4",           desc: "210 × 297 mm" },
  { id: "letter",   label: "Letter",       desc: "8.5 × 11 in" },
  { id: "original", label: "Original size",desc: "Matches image dimensions" },
];

const MARGINS = [
  { id: "none",  label: "No margins" },
  { id: "small", label: "Small margins" },
  { id: "large", label: "Large margins" },
];

export default function JpgToPdfToolUI() {
  const [imgs, setImgs]       = useState<ImgEntry[]>([]);
  const [pageSize, setPageSize] = useState("a4");
  const [margin, setMargin]   = useState("small");
  const [status, setStatus]   = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState<{ blob: Blob; filename: string; pages?: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return;
    const accepted = Array.from(list).filter(f => f.type.startsWith("image/"));
    setImgs(p => [...p, ...accepted.map(file => ({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) }))]);
  }, []);

  const remove = (id: string) => setImgs(p => {
    const e = p.find(x => x.id === id);
    if (e) URL.revokeObjectURL(e.preview);
    return p.filter(x => x.id !== id);
  });

  const handleConvert = async () => {
    if (!imgs.length) return;
    setError(""); setStatus("uploading"); setProgress(0);
    const tick = setInterval(() => setProgress(p => Math.min(p + 8, 88)), 250);
    try {
      const res = await apiJpgToPdf(imgs.map(e => e.file), pageSize, margin);
      clearInterval(tick); setProgress(100);
      setResult({ blob: res.blob, filename: res.filename, pages: res.meta.pages });
      setStatus("done");
    } catch (err) {
      clearInterval(tick);
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
      setStatus("error");
    }
  };

  const reset = () => {
    imgs.forEach(e => URL.revokeObjectURL(e.preview));
    setImgs([]); setStatus("idle"); setError(""); setResult(null); setProgress(0);
  };

  if (status === "uploading") return (
    <div className="text-center py-14">
      <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto mb-4" />
      <p className="font-semibold text-gray-700">Uploading {imgs.length} image{imgs.length > 1 ? "s" : ""} and creating PDF…</p>
      <div className="max-w-xs mx-auto mt-5">
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-brand-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">First request may take ~30s on free tier</p>
    </div>
  );

  if (status === "done" && result) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">PDF created!</h3>
      <p className="text-sm text-gray-500 mb-8">
        {result.pages ?? imgs.length} page{(result.pages ?? imgs.length) !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => downloadResult(result.blob, result.filename)}
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          <Download className="w-4 h-4" /> Download PDF
        </button>
        <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-8 py-3 rounded-xl transition-colors">
          Convert more
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div onClick={() => inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-200 hover:border-brand-400 bg-gray-50 hover:bg-brand-50 rounded-2xl p-10 text-center cursor-pointer transition-all">
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only"
          onChange={e => addFiles(e.target.files)} />
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="font-semibold text-gray-700 mb-1">Drop images here</p>
        <p className="text-sm text-gray-400">JPG, PNG, WebP supported</p>
      </div>

      {imgs.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Images ({imgs.length})</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {imgs.map(e => (
              <div key={e.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.preview} alt={e.file.name} className="w-full h-full object-cover" />
                <button onClick={() => remove(e.id)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-brand-400 flex items-center justify-center cursor-pointer transition-colors">
              <span className="text-2xl text-gray-300">+</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Page size</p>
          <div className="space-y-1">
            {PAGE_SIZES.map(opt => (
              <label key={opt.id} className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${pageSize === opt.id ? "border-brand-600 bg-brand-50" : "border-gray-100 hover:border-gray-200"}`}>
                <input type="radio" name="pageSize" checked={pageSize === opt.id} onChange={() => setPageSize(opt.id)} className="mt-0.5 accent-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Margins</p>
          <div className="space-y-1">
            {MARGINS.map(opt => (
              <label key={opt.id} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${margin === opt.id ? "border-brand-600 bg-brand-50" : "border-gray-100 hover:border-gray-200"}`}>
                <input type="radio" name="margin" checked={margin === opt.id} onChange={() => setMargin(opt.id)} className="accent-red-600" />
                <p className="text-sm font-medium text-gray-800">{opt.label}</p>
              </label>
            ))}
          </div>
        </div>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {error.includes("server") ? <WifiOff className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {error}
        </div>
      )}

      <button onClick={handleConvert} disabled={!imgs.length}
        className="w-full py-4 rounded-2xl font-bold text-base transition-all bg-brand-600 hover:bg-brand-700 text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
        {!imgs.length ? "Add images to convert" : `Convert ${imgs.length} image${imgs.length > 1 ? "s" : ""} to PDF`}
      </button>
    </div>
  );
}
