# PDFTools - Free Online PDF Tool

A full-featured PDF tools website built with Next.js 15, TypeScript, and Tailwind CSS. Inspired by iLovePDF with clean branding and SEO optimization.

## Features

- 28 PDF tools (merge, split, compress, convert, edit, security, AI)
- SEO optimized with metadata, sitemap, robots.txt, structured data
- Dynamic tool pages with file upload UI
- Category filtering on homepage
- Fully responsive (mobile, tablet, desktop)
- Vercel-ready with security headers configured
- PWA manifest included

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your site URL

# 3. Run dev server
npm run dev

# 4. Open http://localhost:3000
```

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Set environment variable: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
5. Click Deploy

That's it. Vercel auto-detects Next.js.

## Project Structure

```
pdftools/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Homepage (hero + tool grid)
│   ├── not-found.tsx       # 404 page
│   ├── sitemap.ts          # Auto-generated XML sitemap
│   ├── robots.ts           # robots.txt
│   └── tools/[slug]/
│       └── page.tsx        # Individual tool page (SEO + upload)
├── components/
│   ├── Navbar.tsx          # Responsive header with dropdowns
│   ├── Footer.tsx          # Footer with links + trust badges
│   ├── ToolCard.tsx        # Tool card for the grid
│   ├── CategoryFilter.tsx  # Client-side category filter tabs
│   └── FileUploader.tsx    # Drag & drop file uploader
├── lib/
│   └── tools.ts            # All 28 tools data + types
├── public/
│   └── manifest.json       # PWA manifest
├── vercel.json             # Vercel config + security headers
└── .env.example            # Environment variable template
```

## Adding PDF Processing

The UI is fully built. To add real PDF processing, you have two options:

### Option A: Client-side (Free, runs in browser)

Install `pdf-lib` and `pdfjs-dist`:

```bash
npm install pdf-lib pdfjs-dist
```

Implement in `components/FileUploader.tsx` inside `handleProcess()`:

```typescript
import { PDFDocument } from 'pdf-lib';

// Example: Rotate PDF
const pdfBytes = await file.arrayBuffer();
const pdfDoc = await PDFDocument.load(pdfBytes);
const pages = pdfDoc.getPages();
pages.forEach(page => page.setRotation(degrees(90)));
const rotatedPdf = await pdfDoc.save();
const blob = new Blob([rotatedPdf], { type: 'application/pdf' });
```

Best for: merge, split, rotate, protect, unlock, add watermark, add page numbers.

### Option B: Server-side API Routes (for conversion tools)

Create `app/api/tools/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  // Process with LibreOffice, Ghostscript, or a third-party API
  // e.g., ConvertAPI, CloudConvert, or your own server
  
  return NextResponse.json({ downloadUrl: '...' });
}
```

Best for: Word to PDF, Excel to PDF, OCR, AI tools (requires Python/Node backend).

### Recommended PDF APIs

| API | Free tier | Notes |
|-----|-----------|-------|
| [ConvertAPI](https://www.convertapi.com) | 250 conversions | Easy REST API |
| [iLoveAPI](https://iloveapi.com) | Limited | Same engine as iLovePDF |
| [CloudConvert](https://cloudconvert.com) | 25/day free | Most formats |
| [PDF.co](https://pdf.co) | 100/month | Good for OCR |

## SEO Optimization

Each tool page has:
- Unique `<title>` and `<meta description>`
- Canonical URL
- OpenGraph + Twitter Card tags
- JSON-LD structured data (WebApplication schema)
- Keywords from tools.ts

The sitemap at `/sitemap.xml` includes all 28 tool pages plus static pages.

## Customization

### Change branding
- Edit site name: `app/layout.tsx` (SITE_NAME constant)
- Change colors: `tailwind.config.ts` (brand color palette)
- Update logo: `components/Navbar.tsx`

### Add a new tool
In `lib/tools.ts`, add to the TOOLS array:

```typescript
{
  slug: "my-new-tool",
  name: "My New Tool",
  shortName: "New Tool",
  description: "Short description for card.",
  longDescription: "Longer description for tool page.",
  category: "edit",
  iconBg: "#FEF3C7",
  iconColor: "#D97706",
  accept: ".pdf",
  acceptLabel: "PDF file",
  keywords: ["keyword1", "keyword2"],
},
```

That's it. The tool page, sitemap, and navbar all update automatically.

## License

MIT. Free to use and modify.
