import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TaskScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50 p-4">
            <View className="flex-1 items-center justify-center">
                <Text className="text-2xl font-bold text-gray-800">📋 任務列表</Text>
                <Text className="text-gray-500 mt-2">這裡之後會放 React Hook Form 表單</Text>
            </View>
        </SafeAreaView>
    );
}