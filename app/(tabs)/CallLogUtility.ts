// CallLogUtility.ts
import { openDatabaseSync } from "expo-sqlite/next";
import { PermissionsAndroid, Platform } from "react-native";
import CallLogs from "react-native-call-log";

export const fetchAndSaveCallLogs = async () => {
  try {
    if (Platform.OS === "android") {
      // Request permission for Android
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: "Call Log Permission",
          message: "This app needs access to your call logs.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.error("Call log permission denied");
        return;
      }
    }

    // Fetch call logs
    const callLogs = await CallLogs.getCallLogs();

    const expoDb = openDatabaseSync("callLogs.db");
    const db = drizzle(expoDb, { schema });

    callLogs.forEach((log: any) => {
      db.insert()
        .into("callLogs")
        .values({
          taskId: 1,
          callTime: new Date(log.date).getTime(),
          callStatus: log.type,
          duration: log.duration,
        });
    });

    console.log("Call logs fetched and saved successfully");
  } catch (error) {
    console.error("Error fetching and saving call logs:", error);
  }
};
