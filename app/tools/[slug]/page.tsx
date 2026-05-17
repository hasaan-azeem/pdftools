import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Shield, Clock, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolUIRouter from "@/components/ToolUIRouter";
import ToolCard from "@/components/ToolCard";
import { TOOLS, getToolBySlug, CATEGORIES } from "@/lib/tools";

// Generate all static routes at build time (optional, for static export)
export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

// Generate SEO metadata per tool
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const title = `${tool.name} - Free Online ${tool.name}`;
  const description = `${tool.longDescription} 100% free, no signup needed. Process your files securely online.`;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// Related tools (same category, excluding current)
function getRelated(slug: string, limit = 5) {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return TOOLS.filter((t) => t.category === tool.category && t.slug !== slug).slice(0, limit);
}

// Category label helper
function getCategoryLabel(cat: string): string {
  return CATEGORIES.find((c) => c.id === cat)?.label ?? cat;
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) notFound();

  const related = getRelated(slug);

  // Structured data for tool page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.longDescription,
    url: `https://pdftools.app/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-800 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <Link
                href={`/?category=${tool.category}`}
                className="hover:text-gray-800 transition-colors"
              >
                {getCategoryLabel(tool.category)}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-gray-900 font-medium">{tool.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tool header */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-card">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: tool.iconBg }}
                  >
                    {/* Dynamic tool icon */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-7 h-7"
                      stroke={tool.iconColor}
                      strokeWidth={1.8}
                    >
                      <path
                        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="8" y1="13" x2="16" y2="13" />
                      <line x1="8" y1="17" x2="16" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        {tool.name}
                      </h1>
                      {tool.badge && (
                        <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500">{tool.longDescription}</p>
                  </div>
                </div>

                {/* Tool UI (real processor or fallback) */}
                <ToolUIRouter tool={tool} />
              </div>

              {/* How to use */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  How to {tool.name.toLowerCase()}
                </h2>
                <ol className="space-y-4">
                  {[
                    `Click "Select files" or drag and drop your ${tool.acceptLabel} into the upload area above.`,
                    `Wait a moment while we securely upload and process your file using our servers.`,
                    `Click the download button to save your processed file. Done!`,
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Frequently asked questions
                </h2>
                <div className="space-y-5">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Is {tool.name} free to use?
                    </h3>
                    <p className="text-sm text-gray-500">
                      Yes! {tool.name} is completely free to use. No account required for
                      files under 100MB. Upgrade to Pro for unlimited file sizes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Is my file kept private?
                    </h3>
                    <p className="text-sm text-gray-500">
                      Absolutely. All transfers are SSL encrypted. Files are automatically
                      deleted from our servers 2 hours after processing. We never share or
                      store your data.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      What file formats are supported?
                    </h3>
                    <p className="text-sm text-gray-500">
                      This tool accepts: {tool.accept.replace(/\./g, "").replace(/,/g, ", ").toUpperCase()} files.
                      Maximum file size is 100MB for free users.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Security info */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
                <h3 className="font-bold text-gray-900 text-sm mb-4">
                  Why trust PDFTools?
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Shield,
                      color: "text-green-600",
                      bg: "bg-green-50",
                      title: "SSL Encrypted",
                      desc: "All file transfers secured with 256-bit SSL",
                    },
                    {
                      icon: Clock,
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                      title: "Auto-deleted",
                      desc: "Files are deleted after 2 hours automatically",
                    },
                    {
                      icon: Zap,
                      color: "text-yellow-600",
                      bg: "bg-yellow-50",
                      title: "Fast processing",
                      desc: "Cloud-powered processing in seconds",
                    },
                  ].map(({ icon: Icon, color, bg, title, desc }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related tools */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">
                    Related tools
                  </h3>
                  <div className="space-y-2">
                    {related.map((rt) => (
                      <Link
                        key={rt.slug}
                        href={`/tools/${rt.slug}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: rt.iconBg, color: rt.iconColor }}
                        >
                          {rt.shortName.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-brand-600 transition-colors">
                          {rt.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All tools CTA */}
              <Link
                href="/"
                className="block bg-brand-50 border border-brand-100 rounded-2xl p-5 text-center hover:bg-brand-100 transition-colors"
              >
                <p className="text-sm font-semibold text-brand-700 mb-1">
                  See all 28 PDF tools
                </p>
                <p className="text-xs text-brand-500">
                  Merge, split, compress, convert and more
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
