import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  //uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey(),
  //accoding to a stackoverflow post, the primary key is autoincremented by default
  name: text("name"),
  contactNumber: text("contactNumber"),
  city: text("city"),
  state: text("state"),
  targetCallCount: integer("targetCallCount"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
  modifiedAt: integer("modified_at", { mode: "timestamp_ms" }),
});

export const callLogs = sqliteTable("callLogs", {
  id: integer("id").primaryKey(),
  taskId: integer("taskId"),
  callTime: integer("callTime"),
  callStatus: text("callStatus"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
  duration: integer("duration"),
});
