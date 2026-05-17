"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X, FileText } from "lucide-react";
import { TOOLS } from "@/lib/tools";

const NAV_SECTIONS = [
  {
    label: "Organize PDF",
    slugs: [
      "merge-pdf",
      "split-pdf",
      "remove-pages",
      "extract-pages",
      "organize-pdf",
    ],
  },
  {
    label: "Optimize PDF",
    slugs: ["compress-pdf", "repair-pdf", "ocr-pdf"],
  },
  {
    label: "Convert to PDF",
    slugs: [
      "jpg-to-pdf",
      "word-to-pdf",
      "powerpoint-to-pdf",
      "excel-to-pdf",
      "html-to-pdf",
    ],
  },
  {
    label: "Convert from PDF",
    slugs: ["pdf-to-jpg", "pdf-to-word", "pdf-to-powerpoint", "pdf-to-excel"],
  },
  {
    label: "Edit PDF",
    slugs: [
      "rotate-pdf",
      "add-page-numbers",
      "add-watermark",
      "crop-pdf",
      "edit-pdf",
    ],
  },
  {
    label: "PDF Security",
    slugs: [
      "unlock-pdf",
      "protect-pdf",
      "sign-pdf",
      "redact-pdf",
      "compare-pdf",
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getTools = (slugs: string[]) =>
    slugs.map((s) => TOOLS.find((t) => t.slug === s)).filter(Boolean);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">
              PDF<span className="text-brand-600">Tools</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_SECTIONS.map((section) => (
              <div
                key={section.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(section.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  {section.label.replace(" PDF", "")}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {activeDropdown === section.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-scale-in">
                    {getTools(section.slugs).map((tool) => (
                      <Link
                        key={tool!.slug}
                        href={`/tools/${tool!.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            background: tool!.iconBg,
                            color: tool!.iconColor,
                          }}
                        >
                          {tool!.shortName.slice(0, 2).toUpperCase()}
                        </span>
                        {tool!.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/tools/ai-summarizer"
              className="px-3 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors flex items-center gap-1"
            >
              AI Tools
              <span className="bg-cyan-100 text-cyan-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                New
              </span>
            </Link>
          </div>

          {/* Auth buttons
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Sign up free
            </Link>
          </div> */}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 pt-4 pb-1">
                  {section.label}
                </p>
                {getTools(section.slugs).map((tool) => (
                  <Link
                    key={tool!.slug}
                    href={`/tools/${tool!.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-2 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: tool!.iconBg,
                        color: tool!.iconColor,
                      }}
                    >
                      {tool!.shortName.slice(0, 2).toUpperCase()}
                    </span>
                    {tool!.name}
                  </Link>
                ))}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-700"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-lg"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
