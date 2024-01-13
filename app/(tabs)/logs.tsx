/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";

import { Text, View } from "../../components/Themed";
import { getContactNumbers } from "../../lib/db_helpers";
import { checkPermission, loadCallLogs } from "../../lib/permissions";
import { CallLogItem } from "../../lib/types";

export default function TabTwoScreen() {
  const [callLogs, setCallLogs] = useState<CallLogItem[]>([]);

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        await checkPermission();
        const logs = await loadCallLogs();
        const contactNumbers = await getContactNumbers();
        const filteredLogs = logs.filter((log) =>
          contactNumbers.includes(log.phoneNumber),
        );

        console.log("Filtered logs:", filteredLogs);

        const formattedLogs: CallLogItem[] = filteredLogs.map((log) => {
          return {
            phoneNumber: log.phoneNumber,
            callType: log.callType,
            callDate: new Date(log.timestamp).toLocaleString(),
            callDuration: log.duration,
          };
        });

        console.log("Formatted logs:", formattedLogs);
        setCallLogs(formattedLogs);
      } catch (e) {
        console.error("Error fetching call logs:", e);
      }
    };

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
