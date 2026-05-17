"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X, Download, Loader2, CheckCircle, AlertCircle, WifiOff } from "lucide-react";
import { apiCompress, downloadResult, formatBytes, ApiError } from "@/lib/api";

type Status = "idle" | "processing" | "done" | "error";

const LEVELS = [
  { id: "basic" as const, label: "Recommended", desc: "Strips metadata, optimizes structure. Text stays selectable." },
  { id: "extreme" as const, label: "Maximum", desc: "Re-encodes pages as JPEG 75%. Best compression. Text not selectable after.", warn: true },
];

export default function CompressToolUI() {
  const [file, setFile]     = useState<File | null>(null);
  const [mode, setMode]     = useState<"basic" | "extreme">("basic");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError]   = useState("");
  const [result, setResult] = useState<{ blob: Blob; filename: string; origSize: number; newSize: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCompress = async () => {
    if (!file) return;
    setError(""); setStatus("processing"); setProgress(0);
    const tick = setInterval(() => setProgress(p => Math.min(p + 5, 90)), 300);
    try {
      const res = await apiCompress(file, mode);
      clearInterval(tick); setProgress(100);
      setResult({
        blob: res.blob, filename: res.filename,
        origSize: res.meta.originalSize ?? file.size,
        newSize: res.meta.compressedSize ?? res.blob.size,
      });
      setStatus("done");
    } catch (err) {
      clearInterval(tick);
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
      setStatus("error");
    }
  };

  const reset = () => { setFile(null); setStatus("idle"); setError(""); setResult(null); setProgress(0); };

  if (status === "processing") return (
    <div className="text-center py-14">
      <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto mb-4" />
      <p className="font-semibold text-gray-700">
        {mode === "extreme" ? "Re-encoding pages on server…" : "Compressing PDF on server…"}
      </p>
      <div className="max-w-xs mx-auto mt-5">
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-brand-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">First request may take ~30s on free tier</p>
    </div>
  );

  if (status === "done" && result) {
    const saved = result.origSize - result.newSize;
    const pct = ((saved / result.origSize) * 100).toFixed(1);
    const improved = saved > 0;
    return (
      <div className="text-center py-10">
        <div className={`w-16 h-16 ${improved ? "bg-green-100" : "bg-yellow-100"} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <CheckCircle className={`w-8 h-8 ${improved ? "text-green-600" : "text-yellow-600"}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {improved ? "Compression complete!" : "File already optimized"}
        </h3>
        <div className="flex justify-center gap-10 mb-8">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-gray-400">{formatBytes(result.origSize)}</p>
            <p className="text-xs text-gray-400 mt-1">Original</p>
          </div>
          <div className="flex items-center text-gray-300 text-xl font-light">→</div>
          <div className="text-center">
            <p className={`text-2xl font-extrabold ${improved ? "text-green-600" : "text-gray-700"}`}>{formatBytes(result.newSize)}</p>
            <p className="text-xs text-gray-400 mt-1">{improved ? `${pct}% smaller` : "similar size"}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => downloadResult(result.blob, result.filename)}
            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            <Download className="w-4 h-4" /> Download compressed PDF
          </button>
          <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-8 py-3 rounded-xl transition-colors">
            Compress another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!file ? (
        <div onClick={() => inputRef.current?.click()}
          onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0] ?? null); }}
          onDragOver={e => e.preventDefault()}
          className="border-2 border-dashed border-gray-200 hover:border-brand-400 bg-gray-50 hover:bg-brand-50 rounded-2xl p-12 text-center cursor-pointer transition-all">
          <input ref={inputRef} type="file" accept=".pdf" className="sr-only"
            onChange={e => setFile(e.target.files?.[0] ?? null)} />
          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 mb-1">Drop your PDF here</p>
          <p className="text-sm text-gray-400">or click to browse</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
          </div>
          <button onClick={reset} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Compression mode</p>
        {LEVELS.map(opt => (
          <label key={opt.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${mode === opt.id ? "border-brand-600 bg-brand-50" : "border-gray-100 hover:border-gray-200"}`}>
            <input type="radio" name="mode" checked={mode === opt.id} onChange={() => setMode(opt.id)} className="mt-0.5 accent-red-600" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              {opt.warn && <p className="text-xs text-amber-600 font-medium mt-1">⚠ Text will not be selectable</p>}
            </div>
          </label>
        ))}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {error.includes("server") ? <WifiOff className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {error}
        </div>
      )}

      <button onClick={handleCompress} disabled={!file}
        className="w-full py-4 rounded-2xl font-bold text-base transition-all bg-brand-600 hover:bg-brand-700 text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
        Compress PDF
      </button>
    </div>
  );
}
