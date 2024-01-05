import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

import { callLogs } from "./drizzle/schema";

const expo = openDatabaseSync("callLogs.db");
const db = drizzle(expo);
await db.select().from(callLogs);
