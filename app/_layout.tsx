import {Stack} from 'expo-router';
import '../global.css'

export default function RootLayout() {
    return (
        <Stack>
            {/* 這裡設定 headerShown: false，因為我們的主畫面是 Tabs，不需要再多一層 Stack Header */}
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="+not-found"/>
        </Stack>
    );
}