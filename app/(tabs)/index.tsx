/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FlatList, TouchableOpacity, Linking, Platform } from "react-native";
import call from "react-native-phone-call";

import { Text, View } from "../../components/Themed";

// Use different libraries based on the environment
// const callLib =
//   Platform.OS === "expo"
//     ? require("react-native-phone-call")
//     : require("react-native-immediate-phone-call");

interface Task {
  id: string;
  name: string;
  contactNumber: string;
  trials: number;
}

export default function TabOneScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Task 1", contactNumber: "+917208208480", trials: 3 },
    { id: "2", name: "Task 2", contactNumber: "+919113317500", trials: 5 },
    { id: "3", name: "Task 3", contactNumber: "555-555-5555", trials: 2 },
    { id: "4", name: "Task 4", contactNumber: "111-222-3333", trials: 7 },
    { id: "5", name: "Task 5", contactNumber: "444-444-4444", trials: 1 },
    { id: "6", name: "Task 6", contactNumber: "888-888-8888", trials: 4 },
    { id: "7", name: "Task 7", contactNumber: "999-999-9999", trials: 6 },
    { id: "8", name: "Task 8", contactNumber: "777-777-7777", trials: 2 },
    { id: "9", name: "Task 9", contactNumber: "666-666-6666", trials: 5 },
    { id: "10", name: "Task 10", contactNumber: "333-333-3333", trials: 8 },
    { id: "11", name: "Task 11", contactNumber: "222-222-2222", trials: 1 },
    { id: "12", name: "Task 12", contactNumber: "555-123-4567", trials: 4 },
    { id: "13", name: "Task 13", contactNumber: "987-654-9876", trials: 6 },
    { id: "14", name: "Task 14", contactNumber: "111-222-3333", trials: 3 },
    { id: "15", name: "Task 15", contactNumber: "999-888-7777", trials: 2 },
  ]);

  // Function to handle call button press
  // const handleCallPress = (contactNumber: string) => {
  //   const args = {
  //     number: contactNumber,
  //     prompt: false,
  //   };

  //   callLib.immediatePhoneCall(args).catch(console.error);
  // };

  const handleCallPress = (contactNumber: string) => {
    const args = {
      number: contactNumber,
      prompt: false,
    };

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
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Task }) => (
          <View>
            <Text>{`Name: ${item.name}`}</Text>
            <Text>{`Contact Number: ${item.contactNumber}`}</Text>
            <Text>{`Trials: ${item.trials}`}</Text>
            {/* Call button */}
            <TouchableOpacity
              onPress={() => handleCallPress(item.contactNumber)}
            >
              <Text className="text-blue-500">Call</Text>
            </TouchableOpacity>
            <View className="border-b border-black mb-10" />
          </View>
        )}
      />
    </View>
  );
}
