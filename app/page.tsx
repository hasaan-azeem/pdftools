import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Zap, Globe, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryFilter from "@/components/CategoryFilter";

export const metadata: Metadata = {
  title: "PDFTools | Free Online PDF Tools",
  description:
    "Every PDF tool you need in one place. Merge, split, compress, convert, rotate, unlock and watermark PDFs. 100% free, no signup required.",
  alternates: { canonical: "/" },
};

const STATS = [
  { label: "Tools available", value: "28+" },
  { label: "Files processed", value: "50M+" },
  { label: "Happy users", value: "10+" },
  { label: "Countries", value: "190+" },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "All uploaded files are encrypted with SSL. Files are permanently deleted from our servers after 2 hours. Your data is never shared.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Our cloud infrastructure processes your files instantly. No waiting in queues. Get your results in seconds, not minutes.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    desc: "PDFTools runs entirely in your browser. No downloads, no installation, no account required for most tools. Works on any device.",
  },
  {
    icon: Star,
    title: "100% Free",
    desc: "All core tools are completely free to use with no hidden charges. Upgrade to Pro for unlimited file sizes and advanced features.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white pt-16 pb-12 overflow-hidden">
          {/* Background decoration */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(220,38,38,0.06) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-brand-100">
             
              28 free PDF tools
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
              Every PDF tool you need,{" "}
              <span className="text-brand-600">in one place</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              Merge, split, compress, convert, rotate, unlock and watermark PDFs.
              All tools are 100% free and easy to use.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { label: "Merge PDF", slug: "merge-pdf" },
                { label: "Split PDF", slug: "split-pdf" },
                { label: "Compress PDF", slug: "compress-pdf" },
                { label: "PDF to Word", slug: "pdf-to-word" },
                { label: "JPG to PDF", slug: "jpg-to-pdf" },
                { label: "Sign PDF", slug: "sign-pdf" },
              ].map((btn) => (
                <Link
                  key={btn.slug}
                  href={`/tools/${btn.slug}`}
                  className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-sm"
                >
                  {btn.label}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-extrabold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tool grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CategoryFilter />
        </section>

        {/* Features section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                The PDF software trusted by millions
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                PDFTools is your go-to platform for all PDF needs. Fast, secure,
                and always free for the essentials.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card"
                >
                  <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-gray-500 mb-12">
              Three simple steps to process your PDF files
            </p>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Select a tool",
                  desc: "Choose from 28 free PDF tools based on what you need to do.",
                },
                {
                  step: "2",
                  title: "Upload your file",
                  desc: "Drag and drop your PDF or click to browse. Works with any PDF up to 100MB.",
                },
                {
                  step: "3",
                  title: "Download result",
                  desc: "Your file is processed instantly. Download and you're done. It's that simple.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-lg font-extrabold mb-4">
                    {step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium CTA */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-4">
              Get more with PDFTools Pro
            </h2>
            <p className="text-brand-100 mb-8 max-w-xl mx-auto">
              Unlimited file sizes, batch processing, priority support, and
              advanced tools like AI summarization and OCR.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="bg-white text-brand-700 font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-sm"
              >
                View Pricing
              </Link>
              <Link
                href="/register"
                className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Start for free
              </Link>
            </div>
          </div>
        </section>

        {/* Trust section */}
        <section className="py-12 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400 mb-8 font-medium uppercase tracking-wide">
              Trusted and certified
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[
                "ISO 27001 Certified",
                "GDPR Compliant",
                "SSL Encrypted",
                "No Ads",
                "Files auto-deleted",
              ].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 text-sm text-gray-600 font-medium"
                >
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
