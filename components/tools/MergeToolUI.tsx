"use client";

import { useRef, useState, useCallback } from "react";
import {
  Upload, X, ArrowUp, ArrowDown, FileText,
  Loader2, CheckCircle, AlertCircle, Download, WifiOff,
} from "lucide-react";
import { apiMerge, downloadResult, formatBytes, ApiError } from "@/lib/api";

interface PdfEntry { id: string; file: File; }
type Status = "idle" | "uploading" | "done" | "error";

export default function MergeToolUI() {
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const [status, setStatus]   = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState<{ filename: string; blob: Blob; pages?: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return;
    const pdfs = Array.from(list).filter(f => f.name.toLowerCase().endsWith(".pdf"));
    setEntries(p => [...p, ...pdfs.map(file => ({ id: crypto.randomUUID(), file }))]);
  }, []);

  const remove = (id: string) => setEntries(p => p.filter(e => e.id !== id));
  const move = (i: number, dir: -1 | 1) => setEntries(prev => {
    const arr = [...prev]; const j = i + dir;
    if (j < 0 || j >= arr.length) return prev;
    [arr[i], arr[j]] = [arr[j], arr[i]]; return arr;
  });

  const handleMerge = async () => {
    setError(""); setStatus("uploading"); setProgress(0);
    const tick = setInterval(() => setProgress(p => Math.min(p + 8, 85)), 200);
    try {
      const res = await apiMerge(entries.map(e => e.file));
      clearInterval(tick); setProgress(100);
      setResult({ filename: res.filename, blob: res.blob, pages: res.meta.pages });
      setStatus("done");
    } catch (err) {
      clearInterval(tick);
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
      setStatus("error");
    }
  };

  const reset = () => { setEntries([]); setStatus("idle"); setError(""); setResult(null); setProgress(0); };

  if (status === "uploading") return (
    <div className="text-center py-14">
      <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto mb-4" />
      <p className="font-semibold text-gray-700">Merging {entries.length} PDFs on server…</p>
      <div className="max-w-xs mx-auto mt-5">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Processing</span><span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-brand-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">First request may take ~30s (server wake-up on free tier)</p>
    </div>
  );

  if (status === "done" && result) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">Merged successfully!</h3>
      <p className="text-sm text-gray-500 mb-8">
        {entries.length} files{result.pages ? ` • ${result.pages} pages` : ""}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => downloadResult(result.blob, result.filename)}
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          <Download className="w-4 h-4" /> Download merged PDF
        </button>
        <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-8 py-3 rounded-xl transition-colors">
          Merge more
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div onClick={() => inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-200 hover:border-brand-400 bg-gray-50 hover:bg-brand-50 rounded-2xl p-10 text-center cursor-pointer transition-all">
        <input ref={inputRef} type="file" accept=".pdf" multiple className="sr-only"
          onChange={e => addFiles(e.target.files)} />
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="font-semibold text-gray-700 mb-1">Drop PDF files here</p>
        <p className="text-sm text-gray-400">or click to browse</p>
      </div>

      {entries.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Files ({entries.length})</p>
          {entries.map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0}
                  className="text-gray-300 hover:text-gray-600 disabled:opacity-20 p-0.5"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button onClick={() => move(i, 1)} disabled={i === entries.length - 1}
                  className="text-gray-300 hover:text-gray-600 disabled:opacity-20 p-0.5"><ArrowDown className="w-3.5 h-3.5" /></button>
              </div>
              <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{entry.file.name}</p>
                <p className="text-xs text-gray-400">{formatBytes(entry.file.size)}</p>
              </div>
              <span className="text-xs font-bold text-gray-300 w-5 text-center">{i + 1}</span>
              <button onClick={() => remove(entry.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button onClick={() => inputRef.current?.click()}
            className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors">
            + Add more PDFs
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {error.includes("server") ? <WifiOff className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {error}
        </div>
      )}

      <button onClick={handleMerge} disabled={entries.length < 2}
        className="w-full py-4 rounded-2xl font-bold text-base transition-all bg-brand-600 hover:bg-brand-700 text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
        {entries.length < 2 ? `Add ${Math.max(0, 2 - entries.length)} more PDF to continue` : `Merge ${entries.length} PDFs`}
      </button>
    </div>
  );
}
