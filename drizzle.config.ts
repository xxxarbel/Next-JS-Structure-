import { defineConfig } from "drizzle-kit";

// drizzle-kit reads .env itself. On ATS Hosting DATABASE_URL comes from the
// environment, and every deploy's release step runs `npx drizzle-kit migrate`.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
