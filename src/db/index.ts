import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// `next build` imports route modules to collect page data, and the build has no
// database, so a missing URL only fails outside the build. postgres.js connects
// on the first query, so the placeholder is never dialled.
const BUILD_PLACEHOLDER_URL = "postgres://build:build@localhost:5432/build";

function databaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url) return url;
  if (process.env.NEXT_PHASE === "phase-production-build") return BUILD_PLACEHOLDER_URL;
  throw new Error(
    "DATABASE_URL is not set: run `pnpm env:init` to create .env, then `pnpm db:up`."
  );
}

// Reuse one connection pool across dev hot reloads. Each reload re-runs this
// module, and a new pool every time soon uses up Postgres's connection limit.
const globalForDb = globalThis as typeof globalThis & { pgClient?: postgres.Sql };

const client = globalForDb.pgClient ?? postgres(databaseUrl());
if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
