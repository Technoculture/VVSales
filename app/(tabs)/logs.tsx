/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";

import { Text, View } from "../../components/Themed";
import { getContactNumbers, postCallLogs } from "../../lib/db_helpers";
import { checkPermission, loadCallLogs } from "../../lib/permissions";
import { CallLogItem } from "../../lib/types";

export default function TabTwoScreen() {
  const [callLogs, setCallLogs] = useState<CallLogItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const formatCallDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    return `${hours > 0 ? hours + "h " : ""}${
      minutes > 0 ? minutes + "m " : ""
    }${seconds}s`;
  };

  const fetchCallLogs = async () => {
    try {
      await checkPermission();
      const logs = await loadCallLogs();
      const contactNumbers = await getContactNumbers();
      const filteredLogs = logs.filter((log) =>
        contactNumbers.includes(log.phoneNumber),
      );
      const formattedLogs: CallLogItem[] = filteredLogs.map((log) => {
        return {
          phoneNumber: log.phoneNumber,
          callDuration: formatCallDuration(log.duration),
        };
      });
      setCallLogs(formattedLogs);
    } catch (e) {
      console.error("Error fetching call logs:", e);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCallLogs();
    await postCallLogs(callLogs);
    setRefreshing(false);
  }, [callLogs]);

  useEffect(() => {
    fetchCallLogs();
    const intervalId = setInterval(() => {
      fetchCallLogs();
    }, 30 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Call Logs</Text>
      <View
        className="my-8 h-px bg-gray-300 w-4/5"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <FlatList
        data={callLogs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }: { item: CallLogItem }) => (
          <View>
            <Text>{`Phone Number: ${item.phoneNumber}`}</Text>
            <Text>{`Call Duration: ${item.callDuration}`}</Text>
            <View className="border-b border-black mb-10" />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}
