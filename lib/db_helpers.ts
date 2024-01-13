import CallLogs from "react-native-call-log";

import { checkPermission, loadCallLogs } from "../lib/permissions";

const getContactNumbers = async () => {
  try {
    console.log("Fetching tasks...");
    const response = await fetch(
      "https://worker-turso-ts.technoculture.workers.dev/tasks",
    );
    const tasks = await response.json();

    console.log("Fetched tasks:", tasks);

    const contactNumbers = tasks.map((task: any) => task.contactNumber);
    console.log("Extracted contact numbers:", contactNumbers);

    return contactNumbers;
  } catch (error) {
    console.error("Error fetching contact numbers:", error);
    return [];
  }
};

const getCallLogs = async () => {
  try {
    await checkPermission();
    await loadCallLogs();
    const callLogs = await CallLogs.loadAll();
    console.log("Call logs fetched successfully:", callLogs);
    return callLogs;
  } catch (error) {
    console.error("Error fetching call logs:", error);
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

const sync = async () => {
  try {
    const callLogs = await getCallLogs();
    await postCallLogs(callLogs);
    const tasks = await getTasks();
    const contactNumbers = await getContactNumbers();
    const tasksToBeUpdated = tasks.filter((task: any) =>
      contactNumbers.includes(task.contactNumber),
    );
    for (const task of tasksToBeUpdated) {
      await updateTask(task.id);
    }
  } catch (error) {
    console.error("Error syncing:", error);
  }
};

export {
  getCallLogs,
  getTasks,
  postCallLogs,
  getContactNumbers,
  updateTask,
  sync,
};
