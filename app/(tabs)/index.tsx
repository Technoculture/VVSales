import { Text, View } from 'react-native';
import EditScreenInfo from '../../components/EditScreenInfo';

export default function TabOneScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white text-red-300">
      <Text className='text-red-200 text-xl'>Open up App.js to start working on your app!</Text>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
