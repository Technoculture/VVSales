import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/local_migrations",
  driver: "expo", // <--- very important
} satisfies Config;
