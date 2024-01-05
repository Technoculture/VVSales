import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import path from "path";

import * as schema from "./schema";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

const client = createClient({
  url: process.env.TURSO_DB_URL || "",
  authToken: process.env.TURSO_DB_AUTH_TOKEN || "",
});

export const db = drizzle(client, { schema });
