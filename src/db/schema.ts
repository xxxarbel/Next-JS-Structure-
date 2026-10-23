/**
 * The database schema: one `pgTable` export per table. After changing it, run
 * `pnpm db:generate` to write a migration into drizzle/, then `pnpm db:migrate`
 * to apply it. For example:
 *
 *   import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
 *
 *   export const notes = pgTable("notes", {
 *     id: uuid("id").primaryKey().defaultRandom(),
 *     title: text("title").notNull(),
 *     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 *   });
 */
export {};
