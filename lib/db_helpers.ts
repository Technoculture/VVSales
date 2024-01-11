import CallLogs from "react-native-call-log";

import { checkPermission } from "../lib/permissions";
// const API_URL = process.env.API_URL;

const getContactNumbers = async () => {
  try {
    const response = await fetch(
      "https://worker-turso-ts.technoculture.workers.dev/tasks",
    );
    const tasks = await response.json();
    console.log("Tasks fetched successfully", tasks);

    const contactNumbers = tasks.map((task: any) => task.contactNumber);
    return contactNumbers;
  } catch (error) {
    console.error("Error fetching contact numbers:", error);
    return [];
  }
};

const getCallLogs = async () => {
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
  try {
    const response = await fetch(
      "https://worker-turso-ts.technoculture.workers.dev/tasks",
    );
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};
const postCallLogs = async (callLogs: any) => {
  try {
    const response = await fetch(
      "https://worker-turso-ts.technoculture.workers.dev/call-logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(callLogs),
      },
    );
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
        //what is this?
      });
    });
    await postCallLogs(callLogsToPost);
    return tasks;
  } catch (error) {
    console.error("Error syncing:", error);
    return [];
  }
};

export { getCallLogs, getTasks, sync, postCallLogs, getContactNumbers };
