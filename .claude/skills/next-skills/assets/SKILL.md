# Assets, Metadata & Bundling

## Images — Always `next/image`
```tsx
import Image from 'next/image'
<Image src={url} alt="descriptive text" width={800} height={600}
  sizes="(max-width: 768px) 100vw, 50vw" priority
  placeholder="blur" blurDataURL={dataUrl} />
```
Never `<img>`. Remote images: add to `images.remotePatterns` in config.

## Fonts — Always `next/font`
```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
// Local: import localFont from 'next/font/local'
```
Never `@import` in CSS (FOUT). Tailwind: use `variable` option → CSS vars.

## Scripts — Always `next/script`
```tsx
import Script from 'next/script'
<Script src="..." strategy="afterInteractive" />  // default
<Script src="..." strategy="lazyOnload" />         // non-critical
<Script id="inline-script">{`window.x = 1`}</Script>  // inline needs id
```

## Bundling Gotchas
| Issue | Fix |
|---|---|
| Server-only pkg in client component | Move to Server Component |
| CSS not applying | `import './styles.css'`, not `<link>` |
| Barrel import bloat | Import directly: `from '@/components/Button'` |
| ESM-only package error | Add to `transpilePackages` |

## Hydration Errors
| Cause | Fix |
|---|---|
| `localStorage`/`window` in render | `useEffect` or `typeof window !== 'undefined'` |
| `Date.now()`/`Math.random()` in render | `useState(() => Date.now())` or `useEffect` |
| Invalid HTML nesting | Fix DOM structure |
| Browser extension injecting nodes | Test incognito |
