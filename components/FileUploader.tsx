"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, File, X, Download, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import type { Tool } from "@/lib/tools";

type Status = "idle" | "dragging" | "uploading" | "processing" | "done" | "error";

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

interface FileUploaderProps {
  tool: Tool;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUploader({ tool }: FileUploaderProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const added: UploadedFile[] = Array.from(newFiles).map((f) => ({
      file: f,
      id: Math.random().toString(36).slice(2),
    }));
    setFiles((prev) => [...prev, ...added]);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setStatus("idle");
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setStatus("dragging");
  };

  const handleDragLeave = () => {
    setStatus("idle");
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setStatus("uploading");
    setProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 70) {
          clearInterval(uploadInterval);
          return 70;
        }
        return p + 10;
      });
    }, 150);

    await new Promise((r) => setTimeout(r, 1200));
    clearInterval(uploadInterval);

    setStatus("processing");
    setProgress(70);

    // Simulate processing progress
    const processInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(processInterval);
          return 100;
        }
        return p + 5;
      });
    }, 80);

    await new Promise((r) => setTimeout(r, 1600));
    clearInterval(processInterval);
    setProgress(100);
    setStatus("done");
  };

  const handleReset = () => {
    setStatus("idle");
    setFiles([]);
    setProgress(0);
    setErrorMsg("");
  };

  // Done state
  if (status === "done") {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">File processed!</h3>
        <p className="text-gray-500 mb-8">
          Your {tool.name.toLowerCase()} is ready to download.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Download file
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-8 py-3 rounded-xl transition-colors"
          >
            Process another
          </button>
        </div>
      </div>
    );
  }

  // Processing / uploading state
  if (status === "uploading" || status === "processing") {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {status === "uploading" ? "Uploading files..." : "Processing..."}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {status === "uploading"
            ? "Securely uploading your files"
            : `Running ${tool.name.toLowerCase()}`}
        </p>
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{status === "uploading" ? "Uploading" : "Processing"}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => files.length === 0 && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
          status === "dragging"
            ? "border-brand-600 bg-brand-50 drop-active scale-[1.01]"
            : files.length > 0
            ? "border-gray-200 bg-gray-50"
            : "border-gray-200 bg-gray-50 hover:border-brand-400 hover:bg-brand-50 cursor-pointer"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={tool.accept}
          multiple={["merge-pdf", "jpg-to-pdf"].includes(tool.slug)}
          onChange={(e) => addFiles(e.target.files)}
        />

        {files.length === 0 ? (
          <div className="py-16 px-8 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: tool.iconBg }}
            >
              <Upload className="w-6 h-6" style={{ color: tool.iconColor }} />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-1">
              Drop your {tool.acceptLabel} here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or{" "}
              <span className="text-brand-600 font-medium underline underline-offset-2">
                browse to upload
              </span>
            </p>
            <p className="text-xs text-gray-400">
              Max 100MB per file. Files are deleted after 2 hours.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: tool.iconBg }}
                >
                  <File className="w-4 h-4" style={{ color: tool.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {f.file.name}
                  </p>
                  <p className="text-xs text-gray-400">{formatBytes(f.file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.id);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Add more files button */}
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              + Add more files
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Process button */}
      {files.length > 0 && (
        <button
          onClick={handleProcess}
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-lg rounded-2xl transition-all shadow-sm hover:shadow-md disabled:opacity-60"
        >
          {tool.name}
        </button>
      )}
    </div>
  );
}
