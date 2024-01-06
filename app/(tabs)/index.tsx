/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, TouchableOpacity, RefreshControl } from "react-native";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import call from "react-native-phone-call";

import { Text, View } from "../../components/Themed";
import { sync } from "../../lib/db_helpers";

interface Task {
  id: string;
  name: string;
  contactNumber: string;
  trials: number;
  city: string;
  state: string;
}

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getTasks = async () => {
    const tasks = await fetch("API_URL" + "/tasks");
    const json = await tasks.json();
    return json;
  };

  const fetchData = useCallback(async () => {
    const tasks = await getTasks();
    setTasks(tasks);
  }, []);

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

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    sync(setTasks);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      sync(setTasks);
    }, 120000);
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
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Task }) => (
          <View>
            <Text>{`Name: ${item.name}`}</Text>
            <Text>{`Contact Number: ${item.contactNumber}`}</Text>
            <Text>{`Trials: ${item.trials}`}</Text>
            <Text>{`City: ${item.city}`}</Text>
            <Text>{`State: ${item.state}`}</Text>
            <Text>{`ID: ${item.id}`}</Text>
            <TouchableOpacity
              onPress={() => handleCallPress(item.contactNumber, item.id)}
            >
              <Text className="text-blue-500">Call</Text>
            </TouchableOpacity>
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
