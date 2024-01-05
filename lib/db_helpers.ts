import { desc, gt } from "drizzle-orm";

import { DB, local_db, turso_db } from "../drizzle/index";
import { callLogs as logsTable, tasks as tasksTable } from "../drizzle/schema";

import { checkPermission } from "../lib/permissions";

const getCallLogs = async (db: DB) => {
  try {
    const CallLogs = await db.select().from(logsTable);
    return CallLogs;
  } catch (error) {
    console.error("Error fetching call logs:", error);
  }
};

const getTasks = async (db: DB) => {
  try {
    const tasks = await db.select().from(tasksTable);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

const syncCallLogs = async (cloud: DB, local: DB) => {
  //1. fetch the timestamp of the last call log from the cloud
  //2. fetch all call logs from the local db that are newer than that timestamp
  //3. insert those call logs into the cloud db
  try {
    const lastCallLog = await cloud
      .select()
      .from(logsTable)
      .orderBy(desc(logsTable.createdAt))
      .limit(1)
      .execute();
    const callLogs = await local
      .select()
      .from(logsTable)
      .where(gt(logsTable.createdAt, lastCallLog[0].createdAt));
    callLogs.forEach((log: any) => {
      cloud.insert(logsTable).values({
        taskId: log.taskId,
        callTime: log.callTime,
        callStatus: log.callStatus,
        duration: log.duration,
      });
    });
    console.log("Call logs synced successfully");
  } catch (error) {
    console.error("Error syncing call logs:", error);
  }
};

const syncCallTasks = async (cloud: DB, local: DB) => {
  //1. fetch the modified at timestamp of the last task from the local db
  //2. fetch all tasks from the cloud db that are newer than that timestamp
  //3. insert those tasks into the local db
  try {
    const lastTask = await local
      .select()
      .from(tasksTable)
      .orderBy(desc(tasksTable.modifiedAt))
      .limit(1)
      .execute();
    if (lastTask.length === 0 || !lastTask) {
      console.log("No tasks found in local db");
      return;
    }
    const tasks = await cloud
      .select()
      .from(tasksTable)
      .where(gt(tasksTable.modifiedAt, lastTask[0].modifiedAt));
    tasks.forEach((task: any) => {
      local.insert(tasksTable).values({
        name: task.name,
        contactNumber: task.contactNumber,
        city: task.city,
        state: task.state,
        targetCallCount: task.targetCallCount,
        modifiedAt: task.modifiedAt,
      });
    });
    console.log("Tasks synced successfully");
  } catch (error) {
    console.error("Error syncing tasks:", error);
  }
};

const sync = async () => {
  try {
    if (await !checkPermission()) return;
    await checkPermission();
    await syncCallLogs(turso_db, local_db);
    await syncCallTasks(turso_db, local_db);
  } catch (error) {
    console.error("Error syncing:", error);
  }
};

export { getCallLogs, getTasks, sync };
