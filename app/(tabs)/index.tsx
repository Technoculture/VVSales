/* eslint-disable @typescript-eslint/no-unused-vars */
import { Image } from "expo-image";
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import call from "react-native-phone-call";

import { Text, View } from "../../components/Themed";
import {
  getTasks,
  getCallLogs,
  postCallLogs,
  updateTask,
  sync,
} from "../../lib/db_helpers";
import { Task } from "../../lib/types";

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      const tasks = await getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchTasks();
    getCallLogs();
    sync();
    const intervalId = setInterval(() => {
      fetchTasks();
    }, 30 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCallPress = async (contactNumber: string, taskId: number) => {
    try {
      await updateTask(taskId);
      RNImmediatePhoneCall.immediatePhoneCall(contactNumber);
    } catch (error) {
      console.error("Error handling call press:", error);
    }
  };

  // Uncomment the following code to use react-native-phone-call instead of react-native-immediate-phone-call
  // const handleCallPress = (contactNumber: string, taskId: string) => {
  // const args = {
  //   number: contactNumber,
  //   prompt: false,
  // };
  // updateTrials(taskId);
  // call(args).catch(console.error);
  // };

  return (
    <View className="flex-1 items-center justify-center">
      {tasks ? (
        tasks.length === 0 ? (
          <Text>No tasks available.</Text>
        ) : (
          <FlatList
            className="w-full p-4"
            data={tasks.rows}
            keyExtractor={(item) => item[0].toString()}
            renderItem={({ item }: { item: Task[] }) => {
              const task = item;
              try {
                return (
                  <View className="flex-row items-center w-full p-4 border-b border-black">
                    <View className="flex-1">
                      <Text className="text-xl font-bold mb-2">{`Name: ${task[1]}`}</Text>
                      <Text>{`Trials: ${task[5]}`}</Text>
                      <View className="flex-row">
                        <Text>{`City: ${task[3]}`}</Text>
                        <Text className="mx-2">|</Text>
                        <Text>{`State: ${task[4]}`}</Text>
                      </View>
                      <Text className="mt-2 font-bold">{`Contact Number: ${task[2]}`}</Text>
                      {/* <Text>{`ID: ${task[0]}`}</Text> */}
                    </View>
                    <TouchableOpacity
                      className="p-2 ml-auto"
                      onPress={() => handleCallPress(task[2], task[0])}
                    >
                      {/* <Text className="text-blue-500">Call</Text> */}
                      <Image
                        className="w-10 h-10"
                        source={require("../../assets/images/call-icon.png")}
                        contentFit="cover"
                        transition={1000}
                      />
                    </TouchableOpacity>
                  </View>
                );
              } catch (error) {
                console.error("Error rendering item:", error);
                return null;
              }
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        )
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
