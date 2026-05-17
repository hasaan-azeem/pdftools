import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pdftools.app";
const SITE_NAME = "PDFTools";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Free Online PDF Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free online PDF tools. Merge, split, compress, convert, rotate, unlock and watermark PDFs in seconds. 100% free and easy to use. No signup required.",
  keywords: [
    "pdf tools online",
    "free pdf editor",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "convert pdf",
    "pdf to word",
    "jpg to pdf",
    "pdf tools free",
    "online pdf converter",
  ],
  authors: [{ name: "PDFTools" }],
  creator: "PDFTools",
  publisher: "PDFTools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Free Online PDF Tools`,
    description:
      "Free online PDF tools. Merge, split, compress, convert, rotate, unlock and watermark PDFs in seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDFTools - Free Online PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Free Online PDF Tools`,
    description:
      "Free online PDF tools. Merge, split, compress, convert, rotate, unlock and watermark PDFs in seconds.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <head>
        {/* Structured data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description:
                "Free online PDF tools. Merge, split, compress, convert, rotate, unlock and watermark PDFs.",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans bg-white text-gray-900 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
