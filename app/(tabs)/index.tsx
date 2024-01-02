/* eslint-disable @typescript-eslint/no-unused-vars */
import { API_URL } from "@env";
import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity, Linking, Platform } from "react-native";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import call from "react-native-phone-call";

import { Text, View } from "../../components/Themed";

interface Task {
  id: string;
  name: string;
  contactNumber: string;
  trials: number;
}

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setTasks(data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const updateTrials = (taskId: string) => {
    // Send a request to update trials on the server
    fetch(`${API_URL}/${taskId}/updateTrials`, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then(() => {
        // Fetch tasks again to get the updated data
        fetchTasks();
      })
      .catch((error) => console.error("Error updating trials:", error));
  };

  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();

    // Set up interval to fetch tasks every 2 minutes
    const intervalId = setInterval(
      () => {
        fetchTasks();
      },
      2 * 60 * 1000,
    );

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Function to handle call button press
  const handleCallPress = (contactNumber: string, taskId: string) => {
    const args = {
      number: contactNumber,
      prompt: false,
    };

    // Update trials and then make the call
    updateTrials(taskId);
    call(args).catch(console.error);
  };

  return (
    <View className="flex-1 items-center justify-center">
      <View
        className="my-6 h-1 w-80% bg-gray-300"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* FlatList to render tasks */}
      {tasks ? (
        tasks.length === 0 ? (
          <Text>No tasks available.</Text>
        ) : (
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
          />
        )
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
