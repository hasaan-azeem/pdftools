import Link from "next/link";
import { FileText, Twitter, Github, Linkedin } from "lucide-react";

const FOOTER_LINKS = {
  Tools: [
    { label: "Merge PDF", href: "/tools/merge-pdf" },
    { label: "Split PDF", href: "/tools/split-pdf" },
    { label: "Compress PDF", href: "/tools/compress-pdf" },
    { label: "PDF to Word", href: "/tools/pdf-to-word" },
    { label: "Word to PDF", href: "/tools/word-to-pdf" },
    { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
    { label: "Sign PDF", href: "/tools/sign-pdf" },
  ],
  Convert: [
    { label: "PDF to JPG", href: "/tools/pdf-to-jpg" },
    { label: "PDF to Excel", href: "/tools/pdf-to-excel" },
    { label: "PDF to PowerPoint", href: "/tools/pdf-to-powerpoint" },
    { label: "Excel to PDF", href: "/tools/excel-to-pdf" },
    { label: "HTML to PDF", href: "/tools/html-to-pdf" },
    { label: "OCR PDF", href: "/tools/ocr-pdf" },
  ],
  Security: [
    { label: "Protect PDF", href: "/tools/protect-pdf" },
    { label: "Unlock PDF", href: "/tools/unlock-pdf" },
    { label: "Redact PDF", href: "/tools/redact-pdf" },
    { label: "Compare PDF", href: "/tools/compare-pdf" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                PDF<span className="text-brand-400">Tools</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Your trusted platform for PDF editing. 100% free, secure, and easy
              to use. No signup required for most tools.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white text-sm mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="py-6 border-t border-gray-800 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-green-400 font-medium">SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-blue-400 font-medium">Files deleted after 2 hours</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-purple-400 font-medium">No signup required</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} PDFTools. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
