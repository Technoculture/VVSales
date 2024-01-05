import { PermissionsAndroid, Platform } from "react-native";
import CallLogs from "react-native-call-log";

const checkPermission = async () => {
  try {
    if (Platform.OS === "android") {
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
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error checking call log permission:", error);
    return false;
  }
};

export { checkPermission };
