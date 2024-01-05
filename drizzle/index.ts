import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import { drizzle as expoDrizzle } from "drizzle-orm/expo-sqlite";
import { drizzle as tursoDrizzle } from "drizzle-orm/libsql";
import { openDatabaseSync } from "expo-sqlite/next";
import path from "path";

import { callLogs, tasks } from "./schema";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

const client = createClient({
  url: process.env.TURSO_DB_URL || "",
  authToken: process.env.TURSO_DB_AUTH_TOKEN || "",
});

const expo = openDatabaseSync("callLogs.db");
const local_db = expoDrizzle(expo);

console.log(await local_db.select().from(callLogs));

const turso_db = tursoDrizzle(client);
console.log(await turso_db.select().from(callLogs));

type DB = typeof local_db | typeof turso_db;
export { local_db, turso_db, DB };
