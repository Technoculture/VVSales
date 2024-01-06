import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  //uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name"),
  contactNumber: text("contactNumber").notNull(),
  city: text("city"),
  state: text("state"),
  targetCallCount: integer("targetCallCount").default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
  modifiedAt: integer("modified_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
});

export const callLogs = sqliteTable("callLogs", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  taskId: integer("taskId"), //foreign key
  callTime: integer("callTime"),
  callStatus: text("callStatus"), //enum: ['incoming', 'outgoing', 'missed', 'rejected']
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
  duration: integer("duration"),
});

export type tasksSelect = typeof tasks.$inferSelect;
export type tasksInsert = typeof tasks.$inferInsert;
export type callLogsSelect = typeof callLogs.$inferSelect;
export type callLogsInsert = typeof callLogs.$inferInsert;
