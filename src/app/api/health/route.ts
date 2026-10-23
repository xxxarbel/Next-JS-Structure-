import { sql } from "drizzle-orm";
import { db } from "@/db";

/** GET /api/health: the app is up; `database` says whether it can reach Postgres. */
export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return Response.json({ status: "ok", database: "up" });
  } catch (err) {
    // In development, say why (container stopped, wrong port or password);
    // production keeps connection details to itself. Drizzle wraps the driver's
    // error, which has the actual reason, as `cause`; a refused connection
    // carries only a code (ECONNREFUSED), no message.
    const reason = err instanceof Error && err.cause instanceof Error ? err.cause : err;
    const detail =
      process.env.NODE_ENV === "development" && reason instanceof Error
        ? reason.message || (reason as NodeJS.ErrnoException).code
        : undefined;
    return Response.json({ status: "error", database: "down", detail }, { status: 503 });
  }
}
