import Link from "next/link";
import type { Tool } from "@/lib/tools";

// Simple SVG icons for each tool type
function ToolIcon({ slug, color, bg }: { slug: string; color: string; bg: string }) {
  const icons: Record<string, React.ReactNode> = {
    "merge-pdf": (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
        <path d="M8 6H4v12h4M16 6h4v12h-4M8 12h8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "split-pdf": (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
        <path d="M12 4v16M8 6H4v12h4M20 6h-4v12h4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 9l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "compress-pdf": (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
        <path d="M12 3v6M9 6l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 21v-6M9 18l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5" y="9" width="14" height="6" rx="2" />
      </svg>
    ),
    "pdf-to-jpg": (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "jpg-to-pdf": (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M8 13l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "rotate-pdf": (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
        <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "protect-pdf": (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "sign-pdf": (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
        <path d="M12 20h9" strokeLinecap="round" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "ai-summarizer": (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke={color} strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );

  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: bg }}
    >
      {icons[slug] || defaultIcon}
    </div>
  );
}

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tool-card group relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 shadow-card hover:shadow-card-hover flex flex-col gap-3 cursor-pointer"
    >
      {tool.badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
          {tool.badge}
        </span>
      )}

      <ToolIcon slug={tool.slug} color={tool.iconColor} bg={tool.iconBg} />

      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-brand-600 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
