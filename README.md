# Next.js Structure

A blank starting point for a Next.js app with a Postgres database in Docker, set up the way ATS Hosting builds and runs it.

- Next.js 16 (App Router, Turbopack, `src/` folder), React 19, TypeScript, Tailwind CSS 4
- Postgres 18 with pgvector in Docker, Drizzle ORM and drizzle-kit migrations
- ESLint and Prettier; pnpm 11 and Node 24, both pinned

## Requirements

- Node 24, and pnpm 11 (`corepack enable` provides the version pinned in `package.json`)
- Docker Desktop, running

## Start a new project from it

1. Copy this folder, or create a repository from this template, and set `name` in `package.json`.
2. `pnpm install`
3. `pnpm db:up` starts Postgres and waits until it's ready. The first time, it also creates `.env` from `.env.example`, with a free port for the database.
4. `pnpm db:migrate` applies the migrations in `drizzle/` (there are none yet).
5. `pnpm dev`, then open http://localhost:3000. http://localhost:3000/api/health checks the database connection.

## Scripts

| Command                       | What it does                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `pnpm dev`                    | Dev server on http://localhost:3000                                              |
| `pnpm build` / `pnpm start`   | Production build, and serving it                                                 |
| `pnpm check`                  | ESLint and TypeScript                                                            |
| `pnpm format`                 | Prettier over the whole project                                                  |
| `pnpm env:init`               | Creates `.env` from `.env.example`, with a free database port                    |
| `pnpm db:up` / `pnpm db:down` | Starts / stops the local Postgres (`db:up` creates `.env` first if it's missing) |
| `pnpm db:psql`                | A psql shell in the database                                                     |
| `pnpm db:logs`                | Follows the database's log                                                       |
| `pnpm db:generate`            | Writes a migration for your schema changes into `drizzle/`                       |
| `pnpm db:migrate`             | Applies pending migrations                                                       |
| `pnpm db:studio`              | Drizzle Studio, a browser view of the data                                       |
| `pnpm db:reset`               | Deletes the local database and rebuilds it from the migrations                   |

In VS Code, the **Dev server** task (Ctrl+Shift+B) starts the database, then the dev server.

## Changing the database

1. Add or change tables in `src/db/schema.ts`.
2. `pnpm db:generate` writes the SQL migration into `drizzle/`.
3. `pnpm db:migrate` applies it locally. Commit the files in `drizzle/` along with the schema.

Server code uses the database through `import { db } from "@/db"`. Don't use `drizzle-kit push`: production only ever gets what's in `drizzle/`.

## Structure

```
├── drizzle/               SQL migrations, written by pnpm db:generate
├── public/                static files, served from /
├── scripts/init-env.mjs   creates .env (pnpm env:init)
├── src/
│   ├── app/               routes: layout.tsx, page.tsx, globals.css
│   │   └── api/health/    GET /api/health: app and database status
│   ├── components/        React components
│   ├── db/                Drizzle client (index.ts) and schema (schema.ts)
│   └── lib/               shared helpers
├── docker-compose.yml     the local Postgres
├── drizzle.config.ts      drizzle-kit settings
├── .env.example           the template for .env
├── AGENTS.md, CLAUDE.md   notes for coding agents
└── DESIGN.md              design notes
```

## Deploying on ATS Hosting

- There's no Dockerfile, so ATS builds with Railpack, using the Node and pnpm versions pinned in `.nvmrc` and `package.json`.
- The build has no database: `src/db/index.ts` only needs `DATABASE_URL` once the app is running.
- Attach a database and keep the release command `npx drizzle-kit migrate` that Add Project suggests. It runs before every deploy goes live, and succeeds even before there are any migrations.
- ATS sets `DATABASE_URL` and `PORT`, and `next start` listens on `PORT`. The deploy's health check is a `GET /`, which has to answer with a status below 500.
