"use client";

import dynamic from "next/dynamic";
import type { Tool } from "@/lib/tools";
import FileUploader from "./FileUploader";

// Dynamically import heavy tool UIs (avoids loading pdfjs/pdf-lib on every page)
const MergeToolUI      = dynamic(() => import("./tools/MergeToolUI"),      { ssr: false });
const CompressToolUI   = dynamic(() => import("./tools/CompressToolUI"),   { ssr: false });
const JpgToPdfToolUI   = dynamic(() => import("./tools/JpgToPdfToolUI"),   { ssr: false });
const PdfToJpgToolUI   = dynamic(() => import("./tools/PdfToJpgToolUI"),   { ssr: false });

const TOOL_MAP: Partial<Record<string, React.ComponentType>> = {
  "merge-pdf":   MergeToolUI,
  "compress-pdf": CompressToolUI,
  "jpg-to-pdf":  JpgToPdfToolUI,
  "pdf-to-jpg":  PdfToJpgToolUI,
};

interface Props {
  tool: Tool;
}

export default function ToolUIRouter({ tool }: Props) {
  const Component = TOOL_MAP[tool.slug];
  if (Component) return <Component />;

  // Fallback: generic upload UI for tools not yet implemented
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
        <span className="font-semibold">Coming soon:</span> {tool.name} processing is being added. For now you can upload and see the interface.
      </div>
      <FileUploader tool={tool} />
    </div>
  );
}
