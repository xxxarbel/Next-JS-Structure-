# Agent notes

## Commands

- `pnpm dev`: the dev server, on http://localhost:3000.
- `pnpm db:up` / `pnpm db:down`: start / stop the local Postgres in Docker (`docker-compose.yml`). `db:up` creates `.env` first if it's missing (`pnpm env:init`).
- After every change, run `pnpm check` (ESLint and TypeScript) and `pnpm build`.

## Database

- Drizzle ORM on Postgres. Tables go in `src/db/schema.ts`; server code imports the client as `import { db } from "@/db"`.
- After a schema change, run `pnpm db:generate`, then `pnpm db:migrate`, and commit the new files in `drizzle/`. Never use `drizzle-kit push`: on ATS Hosting every deploy runs `npx drizzle-kit migrate`, so a change that isn't in a migration never reaches production.
- `next build` runs without a database. Don't query it from anything rendered at build time (static pages, `generateStaticParams`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
