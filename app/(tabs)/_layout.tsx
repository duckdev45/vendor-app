import {Tabs} from 'expo-router';
import {View} from 'react-native';
import {Home, ListTodo, Camera, Bell, User} from 'lucide-react-native';

// 定義一下顏色常數，之後可以搬去 tailwind config 或 theme 檔
const COLORS = {
    primary: '#2563EB', // blue-600
    inactive: '#64748B', // slate-500
    bg: '#FFFFFF',
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                // Tab Bar 的整體樣式
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.inactive,
                tabBarStyle: {
                    backgroundColor: COLORS.bg,
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0', // slate-200
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4
                },
                headerShown: false, // 隱藏預設的頂部 Header (我們之後自己刻)
            }}
        >
            {/* 1. 首頁 (Home) - 對應 index.tsx */}
            <Tabs.Screen
                name="index"
                options={{
                    title: '首頁',
                    tabBarIcon: ({color, size}) => <Home size={size} color={color}/>,
                }}
            />

            {/* 2. 待辦 (Task) */}
            <Tabs.Screen
                name="task"
                options={{
                    title: '待辦',
                    tabBarIcon: ({color, size}) => <ListTodo size={size} color={color}/>,
                }}
            />

            {/* 3. 相機 (Camera) - 暴力修正版 🛠️ */}
            <Tabs.Screen
                name="camera"
                options={{
                    title: '拍照',
                    tabBarIcon: ({color}) => (
                        <View
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 50,
                                backgroundColor: '#2563EB',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 30,
                                // 以下是陰影效果 (iOS + Android)
                                shadowColor: '#000',
                                shadowOffset: {width: 0, height: 4},
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 5,
                            }}
                        >
                            <Camera size={28} color="white"/>
                        </View>
                    ),
                    tabBarLabelStyle: {display: 'none'},
                }}
            />

            {/* 4. 通知 (Notification) */}
            <Tabs.Screen
                name="notification"
                options={{
                    title: '通知',
                    tabBarIcon: ({color, size}) => <Bell size={size} color={color}/>,
                }}
            />

            {/* 5. 設定 (Account) */}
            <Tabs.Screen
                name="account"
                options={{
                    title: '設定',
                    tabBarIcon: ({color, size}) => <User size={size} color={color}/>,
                }}
            />
        </Tabs>
    );
}