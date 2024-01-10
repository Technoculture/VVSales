// import { desc, gt } from "drizzle-orm";
import CallLogs from "react-native-call-log";

// import { DB, local_db, turso_db } from "../drizzle/index";
// import { callLogs as logsTable, tasks as tasksTable } from "../drizzle/schema";
import { checkPermission } from "../lib/permissions";

const API_URL = process.env.API_URL;

//fetch call logs from mobile
const getCallLogs = async () => {
  try {
    if (!(await checkPermission())) return;
    const callLogs = await CallLogs.loadAll();
    return callLogs;
  } catch (error) {
    console.error("Error fetching call logs:", error);
  }
};
//check if data is coming from cloudflare link
const getTasks = async () => {
  try {
    const response = await fetch(API_URL + "/tasks");
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

//post call logs to cloudflare link
const postCallLogs = async (callLogs: any) => {
  try {
    const response = await fetch(API_URL + "/call-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callLogs),
    });
    return response;
  } catch (error) {
    console.error("Error posting call logs:", error);
  }
};

//sync call logs and tasks
const sync = async () => {
  try {
    if (!(await checkPermission())) return;
    const callLogs = await getCallLogs();
    const tasks = await getTasks();
    const callLogsToPost = callLogs.filter((log: any) => {
      return tasks.some((task: any) => {
        return task.contactNumber === log.phoneNumber;
      });
    });
    await postCallLogs(callLogsToPost);

    return tasks;
  } catch (error) {
    console.error("Error syncing:", error);
    return [];
  }
};

export { getCallLogs, getTasks, sync, postCallLogs };

// const syncCallLogs = async (cloud: DB, local: DB) => {
//   try {
//     const lastCallLog = await cloud
//       .select()
//       .from(logsTable)
//       .orderBy(desc(logsTable.createdAt))
//       .limit(1)
//       .execute();
//     const callLogs = await local
//       .select()
//       .from(logsTable)
//       .where(gt(logsTable.createdAt, lastCallLog[0].createdAt));
//     callLogs.forEach((log: any) => {
//       cloud.insert(logsTable).values({
//         taskId: log.taskId,
//         callTime: log.callTime,
//         callStatus: log.callStatus,
//         duration: log.duration,
//       });
//     });
//     console.log("Call logs synced successfully");
//   } catch (error) {
//     console.error("Error syncing call logs:", error);
//   }
// };

// const syncCallTasks = async (cloud: DB, local: DB) => {
//   try {
//     const lastTask = await local
//       .select()
//       .from(tasksTable)
//       .orderBy(desc(tasksTable.modifiedAt))
//       .limit(1)
//       .execute();
//     if (lastTask.length === 0 || !lastTask) {
//       console.log("No tasks found in local db");
//       return;
//     }
//     const tasks = await cloud
//       .select()
//       .from(tasksTable)
//       .where(gt(tasksTable.modifiedAt, lastTask[0].modifiedAt));
//     tasks.forEach((task: any) => {
//       local.insert(tasksTable).values({
//         name: task.name,
//         contactNumber: task.contactNumber,
//         city: task.city,
//         state: task.state,
//         targetCallCount: task.targetCallCount,
//         modifiedAt: task.modifiedAt,
//       });
//     });
//     console.log("Tasks synced successfully");
//   } catch (error) {
//     console.error("Error syncing tasks:", error);
//   }
// };
