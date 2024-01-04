import { PermissionsAndroid } from "react-native";
import CallLogs from "react-native-call-log";

import { initDatabase, db } from "../../database";

const requestCallLogPermission = async () => {
  // ... (unchanged)
};

const fetchAndSaveCallLogs = async () => {
  try {
    const permissionGranted = await requestCallLogPermission();

    if (permissionGranted) {
      const callLogs = await CallLogs.load(-1);
      saveCallLogsToDatabase(callLogs);
    }
  } catch (error) {
    console.error("Error fetching call logs:", error);
  }
};

const saveCallLogsToDatabase = (callLogs) => {
  initDatabase();

  db.transaction((tx) => {
    callLogs.forEach((log) => {
      const { timestamp, duration, callType } = log;
      const taskId = 1; // Replace with the appropriate task ID from your app
      tx.executeSql(
        "INSERT INTO call_logs (timestamp, task_id, call_type, duration) VALUES (?, ?, ?, ?)",
        [timestamp, taskId, callType, duration],
      );
    });
  });
};

export { fetchAndSaveCallLogs };
