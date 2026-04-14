# Runtime Selection & Self-Hosting

## Runtime Selection
Default: Node.js. Only use Edge for specific reasons.

| Node.js | Edge |
|---|---|
| Default, file system, native modules | Global low-latency |
| Full npm ecosystem, DB connections | Tiny payload, no Node APIs |

```ts
export const runtime = 'edge' // explicit opt-in only
```

## Self-Hosting with Docker
```ts
// next.config.ts
const config = { output: 'standalone' }
```
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
CMD ["node", "server.js"]
```

## Multi-Instance ISR (non-Vercel)
Default ISR cache is in-memory per instance. Fix:
```ts
const config = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0,
}
```
Use shared Redis/DB-backed cache handler.

## Static Export Limitations
`output: 'export'` loses: `next/image` optimization, ISR, Middleware, API routes, Server Actions.

## Debug
```bash
next build --debug-build-paths /blog/[slug]
# experimental: { mcpServer: true } for AI-assisted debugging
```
