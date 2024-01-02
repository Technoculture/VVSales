import React, { useEffect, useState } from "react";
import { FlatList, PermissionsAndroid } from "react-native";
import CallLogs from "react-native-call-log";

import { Text, View } from "../../components/Themed";

interface CallLogItem {
  phoneNumber: string;
  callType: string;
  callDate: string;
  callDuration: string;
}

export default function TabTwoScreen() {
  const [callLogs, setCallLogs] = useState<CallLogItem[]>([]);

  useEffect(() => {
    // Function to format call duration
    const formatCallDuration = (duration: string): string => {
      const seconds = parseInt(duration, 10);
      const hours = Math.floor(seconds / 3600);
      const remainingSeconds = seconds % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      const remainingSecondsInMinute = remainingSeconds % 60;

      let formattedDuration = "";

      if (hours > 0) {
        formattedDuration += `${hours} hours `;
      }

      if (minutes > 0) {
        formattedDuration += `${minutes} minutes `;
      }

      if (hours === 0 || (hours === 0 && minutes === 0)) {
        formattedDuration += `${remainingSecondsInMinute} seconds`;
      }

      return formattedDuration.trim();
    };

    // Function to fetch call logs for the current day
    const fetchCallLogs = async () => {
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
          const currentDate = new Date();
          const startOfDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            0,
            0,
            0,
          );

          CallLogs.load(100).then((logs) => {
            console.log("Call logs:", logs);

            const formattedLogs: CallLogItem[] = logs
              .filter((log) => new Date(log.timestamp) >= startOfDay)
              .map((log) => {
                // Log the entire 'log' object to inspect its structure
                console.log("Call log structure:", log);

                return {
                  phoneNumber: log.phoneNumber,
                  callType: log.callType,
                  callDate: new Date(log.timestamp).toLocaleString(),
                  callDuration: formatCallDuration(log.duration),
                };
              });

            console.log("Formatted logs:", formattedLogs);
            setCallLogs(formattedLogs);
          });
        } else {
          console.log("Call Log permission denied");
        }
      } catch (e) {
        console.error("Error fetching call logs:", e);
      }
    };

    // Fetch call logs when the component mounts
    fetchCallLogs();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Call Logs</Text>
      <View
        className="my-8 h-px bg-gray-300 w-4/5"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* FlatList to render call logs */}
      <FlatList
        data={callLogs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }: { item: CallLogItem }) => (
          <View>
            <Text>{`Phone Number: ${item.phoneNumber}`}</Text>
            <Text>{`Call Type: ${item.callType}`}</Text>
            <Text>{`Call Date: ${item.callDate}`}</Text>
            <Text>{`Call Duration: ${item.callDuration}`}</Text>
            <View className="border-b border-black mb-10" />
          </View>
        )}
      />
    </View>
  );
}
