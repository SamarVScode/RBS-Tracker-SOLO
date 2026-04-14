# Assets, Metadata & Bundling — Reference

## Static Metadata
```ts
// app/layout.tsx or any page
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: { template: '%s | MySite', default: 'MySite' },
  description: '...',
  openGraph: { title: '...', images: ['/og.png'] },
}
```

## Dynamic Metadata
```ts
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  return {
    title: post.title,
    openGraph: { images: [`/api/og?id=${id}`] },
  }
}
```

## OG Image Generation
```tsx
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  return new ImageResponse(
    <div style={{ display: 'flex', fontSize: 64, background: 'white', padding: 40 }}>
      {searchParams.get('title')}
    </div>,
    { width: 1200, height: 630 }
  )
}
```

## File-Based Metadata Conventions
| File | Type |
|---|---|
| `app/favicon.ico` | Favicon |
| `app/icon.png` / `icon.tsx` | App icon |
| `app/apple-icon.png` | Apple touch icon |
| `app/opengraph-image.png` / `.tsx` | OG image |
| `app/sitemap.ts` | Returns `MetadataRoute.Sitemap` |
| `app/robots.ts` | Returns `MetadataRoute.Robots` |

## Google Analytics (recommended)
```tsx
import { GoogleAnalytics } from '@next/third-parties/google'
// In layout.tsx:
<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

## Bundle Analysis
```bash
npm install @next/bundle-analyzer
# next.config.ts:
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })
module.exports = withBundleAnalyzer(nextConfig)
# Run:
ANALYZE=true next build
```
