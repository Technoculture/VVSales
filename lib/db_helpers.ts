// import { desc, gt } from "drizzle-orm";
import CallLogs from "react-native-call-log";

// import { DB, local_db, turso_db } from "../drizzle/index";
// import { callLogs as logsTable, tasks as tasksTable } from "../drizzle/schema";
import { checkPermission } from "../lib/permissions";

const API_URL = process.env.API_URL;

const getCallLogs = async () => {
    console.log("Tasks fetched successfully");
  try {
    if (!(await checkPermission())) return [];
    const callLogs = await CallLogs.loadAll();
    console.log("Call logs fetched successfully", callLogs);
    return callLogs;
  } catch (error) {
    console.error("Error fetching call logs:", error);
    return [];
  }
};
const getTasks = async () => {
    console.log("Tasks fetched successfully");
  try {
    const response = await fetch(API_URL + "/tasks");
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};
const postCallLogs = async (callLogs: any) => {
  try {
    const response = await fetch(API_URL + "/call-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callLogs),
    });
    console.log("Call logs posted successfully:", response);
    return response;
  } catch (error) {
    console.error("Error posting call logs:", error);
  }
};
const sync = async () => {
  try {
    if (!(await checkPermission())) return [];
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
