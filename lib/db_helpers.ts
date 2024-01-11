import CallLogs from "react-native-call-log";

import { checkPermission } from "../lib/permissions";

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
    const formattedCallLogs = callLogs.map((log: any) => {
      return {
        taskId: log.taskId,
        callTime: log.timestamp,
        callStatus: log.callType,
        duration: log.duration,
      };
    });

    const response = await fetch(
      "https://worker-turso-ts.technoculture.workers.dev/call-logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedCallLogs),
      },
    );

    console.log("Call logs posted successfully:", response);
    return response;
  } catch (error) {
    console.error("Error posting call logs:", error);
  }
};

const updateTask = async (taskId: number) => {
  try {
    const response = await fetch(
      `https://worker-turso-ts.technoculture.workers.dev/tasks/${taskId}`,
    );
    const task = await response.json();
    task.targetCallCount = Math.max(task.targetCallCount - 1, 0);
    await fetch(
      `https://worker-turso-ts.technoculture.workers.dev/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      },
    );
    console.log("Task updated successfully:", task);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export { getCallLogs, getTasks, postCallLogs, getContactNumbers, updateTask };
