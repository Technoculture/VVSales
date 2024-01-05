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
}

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // fetchData();
    sync();
  }, []);

  // const fetchData = useCallback(() => {
  //   fetchTasks(setTasks);
  // }, []);

  // const updateTrials = (taskId: string) => {
  //   fetchData();
  // };

  const handleRefresh = () => {
    setRefreshing(true);
    sync();
  };

  useEffect(() => {
    // fetchData();
    sync();
  }, []);

  const intervalId = setInterval(
    () => {
      sync();
    },
    2 * 60 * 1000,
  );

  //   return () => clearInterval(intervalId);
  // }, [fetchData]);

  const handleCallPress = (contactNumber: string, taskId: string) => {
    const args = {
      number: contactNumber,
      prompt: false,
    };

    // updateTrials(taskId);
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
