/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import call from "react-native-phone-call";

import { Text, View } from "../../components/Themed";
import {
  getTasks,
  sync,
  getCallLogs,
  postCallLogs,
} from "../../lib/db_helpers";
import { Task } from "../../lib/types";

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      const tasks = await getTasks();
      setTasks(tasks);
      // Removed console.log statement
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTrials = async (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          trials: task.trials + 1,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await getTasks();
        const callLogs = await getCallLogs();
        const tasks = tasksResponse.rows;

        // Use tasks and callLogs data as needed
        console.log("Tasks:", tasks);
        console.log("Call Logs:", callLogs);

        // Add your logic for processing call logs and updating tasks if necessary

        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const postAndSyncCallLogs = async () => {
    try {
      const callLogs = await getCallLogs();
      await postCallLogs(callLogs);
      console.log("Call logs posted successfully.");
    } catch (error) {
      console.error("Error posting call logs:", error);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    await postAndSyncCallLogs();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchTasks();
    getCallLogs();
    const intervalId = setInterval(
      () => {
        fetchTasks();
      },
      5 * 60 * 1000,
    );
    return () => clearInterval(intervalId);
  }, []);

  const handleCallPress = (contactNumber: string, taskId: string) => {
    const args = {
      number: contactNumber,
      prompt: false,
    };
    updateTrials(taskId);
    // RNImmediatePhoneCall.immediatePhoneCall(contactNumber);
    call(args).catch(console.error);
  };

  return (
    <View className="flex-1 items-center justify-center">
      {tasks ? (
        tasks.length === 0 ? (
          <Text>No tasks available.</Text>
        ) : (
          <FlatList
            data={tasks.rows}
            keyExtractor={(item) => item[0].toString()}
            renderItem={({ item }: { item: Task[] }) => {
              const task = item;
              try {
                return (
                  <View>
                    <Text>{`Name: ${task[1]}`}</Text>
                    <Text>{`Contact Number: ${task[2]}`}</Text>
                    <Text>{`Trials: ${task[5]}`}</Text>
                    <Text>{`City: ${task[3]}`}</Text>
                    <Text>{`State: ${task[4]}`}</Text>
                    <Text>{`ID: ${task[0]}`}</Text>
                    <TouchableOpacity
                      onPress={() => handleCallPress(task[2], task[0])}
                    >
                      <Text className="text-blue-500">Call</Text>
                    </TouchableOpacity>
                    <View className="border-b border-black mb-10" />
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
