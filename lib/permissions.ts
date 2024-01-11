import { PermissionsAndroid } from "react-native";
import CallLogs from "react-native-call-log";

import { getContactNumbers } from "../lib/db_helpers";

const checkPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      {
        title: "Permission to Count Calls",
        message: "Access to Call Counts",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const contactNumbers = await getContactNumbers();
      const filter = {
        phoneNumbers: contactNumbers,
      };

      // Load call logs using the filter
      CallLogs.load(-1, filter).then((callLogs) => console.log(callLogs));
    } else {
      console.log("Call Log permission denied");
    }
  } catch (error) {
    console.error("Error checking call log permission:", error);
  }
};

export { checkPermission };
