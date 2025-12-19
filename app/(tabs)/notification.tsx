import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationScreen() {
    return (
        // SafeAreaView 很重要！避免內容被瀏海或 iPhone 底部橫條擋住
        <SafeAreaView className="flex-1 bg-gray-50 p-4">
            <View className="flex-1 items-center justify-center">
                <Text className="text-2xl font-bold text-gray-800">📋 任務列表</Text>
                <Text className="text-gray-500 mt-2">這裡之後會放 React Hook Form 表單</Text>
            </View>
        </SafeAreaView>
    );
}