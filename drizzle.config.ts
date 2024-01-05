import "dotenv/config";
import type { Config } from "drizzle-kit";
export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_URL as string,
    authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
  },
} satisfies Config;

// export expo {
//   schema: "./drizzle/schema.ts",
//   out: "./drizzle/migrations",
//   driver: "expo", // <--- very important
// } satisfies Config;
