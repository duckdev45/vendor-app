import {Tabs} from 'expo-router';
import {View, Platform} from 'react-native';
import {Home, ListTodo, Camera, Bell, User} from 'lucide-react-native';
import {useColorScheme} from "nativewind";

export default function TabLayout() {
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';

    const COLORS = {
        // 主色：深色模式用亮黃 (Amber-400)，淺色模式用橘黃 (Amber-500)
        primary: isDark ? '#FBBF24' : '#F59E0B',

        // 未選取：深色模式亮一點 (Zinc-400)，淺色模式深一點 (Zinc-500)
        inactive: isDark ? '#A1A1AA' : '#71717A',

        // 卡片底色：深色用 Zinc-900，淺色用白
        card: isDark ? '#18181B' : '#FFFFFF',

        // 中間按鈕的 Icon 顏色：黃底配黑圖，橘底配白圖
        cameraIcon: isDark ? '#000000' : '#FFFFFF',
    };

    return (
        <View className={`${colorScheme} flex-1 bg-background`}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.inactive,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 30,
                        left: 20,
                        right: 20,
                        backgroundColor: COLORS.card,
                        borderRadius: 35,
                        height: 75,
                        borderTopWidth: 0,
                        shadowColor: '#000000',
                        shadowOffset: {width: 0, height: 4},
                        shadowOpacity: isDark ? 0.4 : 0.15,
                        shadowRadius: 10,
                        elevation: 10, // Android 陰影
                        paddingBottom: Platform.OS === 'ios' ? 20 : 10, // iOS 底部留白修正
                        paddingTop: 10,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '600',
                        marginTop: 2,
                    },
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: '首頁',
                        tabBarIcon: ({color}) => <Home size={24} color={color}/>,
                    }}
                />
                <Tabs.Screen
                    name="task"
                    options={{
                        title: '任務',
                        tabBarIcon: ({color}) => <ListTodo size={24} color={color}/>,
                    }}
                />

                {/* 拍照按鈕 */}
                <Tabs.Screen
                    name="camera"
                    options={{
                        title: '拍照',
                        tabBarIcon: () => (
                            <View
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 32,
                                    backgroundColor: COLORS.primary,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: Platform.OS === 'ios' ? 35 : 40,
                                    // 統一黑色陰影，製造立體浮空感
                                    shadowColor: '#000000',
                                    shadowOffset: {width: 0, height: 4},
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    elevation: 8,
                                    borderWidth: 4,
                                    borderColor: isDark ? '#000000' : '#F4F4F5',
                                }}
                            >
                                <Camera size={28} color={COLORS.cameraIcon} strokeWidth={2.5}/>
                            </View>
                        ),
                        tabBarLabelStyle: {display: 'none'}, // 隱藏文字
                    }}
                />

                <Tabs.Screen
                    name="notification"
                    options={{
                        title: '通知',
                        tabBarIcon: ({color}) => <Bell size={24} color={color}/>,
                    }}
                />
                <Tabs.Screen
                    name="account"
                    options={{
                        title: '設定',
                        tabBarIcon: ({color}) => <User size={24} color={color}/>,
                    }}
                />
            </Tabs>
        </View>
    );
}