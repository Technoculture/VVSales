/* eslint-disable @typescript-eslint/no-unused-vars */
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
    fetch("https://d6a2-103-136-175-206.ngrok-free.app/tasks")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setTasks(data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
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
  const handleCallPress = (contactNumber: string) => {
    const args = {
      number: contactNumber,
      prompt: false,
    };

    RNImmediatePhoneCall.immediatePhoneCall(args).catch(console.error);
  };

  // const handleCallPress = (contactNumber: string) => {
  //   const args = {
  //     number: contactNumber,
  //     prompt: false,
  //   };

  //   if (RNImmediatePhoneCall && RNImmediatePhoneCall.immediatePhoneCall) {
  //     RNImmediatePhoneCall.immediatePhoneCall(args).catch(() => {
  //       // If immediate call fails, use the alternative method
  //       handleAlternativeCall(args);
  //     });
  //   } else {
  //     // If RNImmediatePhoneCall is not available, use the alternative method
  //     handleAlternativeCall(args);
  //   }
  // };

  // const handleAlternativeCall = (callArgs: {
  //   number: string;
  //   prompt: boolean;
  // }) => {
  //   call(callArgs).catch((error) => {
  //     console.error("Error making the call:", error);
  //   });
  // };

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
                  onPress={() => handleCallPress(item.contactNumber)}
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
