import CallLogs from "react-native-call-log";

import { checkPermission, loadCallLogs } from "../lib/permissions";

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

const getContactNumbers = async () => {
  try {
    const tasks = await getTasks();

    if (Array.isArray(tasks.rows)) {
      const contactNumbers = tasks.rows.map((task: any) => task[2]);
      return contactNumbers;
    } else {
      console.error(
        "Error: Tasks is not an array or does not have 'rows':",
        tasks,
      );
      return [];
    }
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

const postCallLogs = async (callLogs: any) => {
  try {
    // Check if the post has already been made for the current day
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0];
    console.log("Current date:", currentDateString);

    const responseCheck = await fetch(
      `https://worker-turso-ts.technoculture.workers.dev/call-logs`,
    );

    const existingLogs = await responseCheck.json();

    if (existingLogs.rows.length === 0) {
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
    } else {
      console.log("Call logs already posted for today.");
    }
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
    console.log("Response from server:", response);
    console.log("Task received:", task);
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
