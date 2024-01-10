/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, TouchableOpacity, RefreshControl } from "react-native";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import call from "react-native-phone-call";

import { Text, View } from "../../components/Themed";
import { getTasks, sync } from "../../lib/db_helpers";
import { Task } from "../../lib/types";

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      const tasks = await getTasks();
      setTasks(tasks);
      console.log(tasks);
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

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const updatedTasks = await sync();
    setTasks(updatedTasks);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchTasks();
    const intervalId = setInterval(
      () => {
        sync();
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
    updateTrials(taskId);
    call(args).catch(console.error);
  };

  return (
    <View className="flex-1 items-center justify-center">
      {tasks ? (
        tasks.length === 0 ? (
          <Text>No tasks available.</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: { item: Task }) => {
              try {
                return (
                  <View>
                    <Text>{`Name: ${item.name}`}</Text>
                    <Text>{`Contact Number: ${item.contactNumber}`}</Text>
                    <Text>{`Trials: ${item.trials}`}</Text>
                    <Text>{`City: ${item.city}`}</Text>
                    <Text>{`State: ${item.state}`}</Text>
                    <Text>{`ID: ${item.id}`}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        handleCallPress(item.contactNumber, item.id)
                      }
                    >
                      <Text className="text-blue-500">Call</Text>
                    </TouchableOpacity>
                    <View className="border-b border-black mb-10" />
                  </View>
                );
              } catch (error) {
                console.error("Error rendering item:", error);
                return null; // or some fallback UI
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
