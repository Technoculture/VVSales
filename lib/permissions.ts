import { PermissionsAndroid } from "react-native";
import CallLogs from "react-native-call-log";

const checkPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      {
        title: "Call Log Example",
        message: "Access your call logs",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log(CallLogs);
      CallLogs.load(-1).then((c) => console.log(c));
      //according to documentation, if this is -1, it will load all call logs, and we can apply filter based on call logs and phone numbers and map them to tasks, it will filter out call logs for potential clients only
    } else {
      console.log("Call Log permission denied");
    }
  } catch (error) {
    console.error("Error checking call log permission:", error);
    return false;
  }
};

export { checkPermission };
