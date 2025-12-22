import {Tabs} from 'expo-router';
import {View, Platform} from 'react-native';
import {Home, ListTodo, Camera, Bell, User} from 'lucide-react-native';
import {useColorScheme} from "nativewind";

export default function TabLayout() {
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';

    const COLORS = {
        primary: isDark ? '#FBBF24' : '#F59E0B',
        // 深色模式下用亮灰 (Zinc-300)，淺色用深灰 (Zinc-500)
        inactive: isDark ? '#D4D4D8' : '#71717A',
        card: isDark ? '#18181B' : '#FFFFFF',
        cameraIcon: isDark ? '#000000' : '#FFFFFF',
    };

    return (
        <View style={{flex: 1}} className={colorScheme}>
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
                        elevation: 10,
                        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
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
                        tabBarLabelStyle: {display: 'none'},
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