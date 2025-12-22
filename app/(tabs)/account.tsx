import {View, Text, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState} from 'react';
import {
    User, Type, Bell, Moon, Lock, FileText, LogOut, ChevronRight, Smartphone
} from 'lucide-react-native';
import {useColorScheme} from 'nativewind';

export default function AccountScreen() {
    // 取出控制權：colorScheme (目前狀態), toggleColorScheme (切換函數)
    const {colorScheme, toggleColorScheme} = useColorScheme();

    // 控制 Switch 顯示的 (判斷目前是否為 dark)
    const isDarkMode = colorScheme === 'dark';

    const [isNotifEnabled, setIsNotifEnabled] = useState(true);

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1">

                {/* Header */}
                <View className="px-5 pt-4 pb-6 border-b border-border">
                    <Text className="text-foreground text-3xl font-bold mb-6">設定與帳號</Text>

                    {/* 個人資料卡片 */}
                    <View className="flex-row items-center bg-card p-4 rounded-2xl border border-border">
                        <View
                            className="w-16 h-16 rounded-full bg-muted items-center justify-center border border-border mr-4">
                            <User size={32} color={isDarkMode ? '#F4F4F5' : '#71717A'}/>
                        </View>
                        <View className="flex-1">
                            <Text className="text-foreground text-xl font-bold">Admin</Text>
                            <Text className="text-muted-foreground text-sm">工管部 | 資訊</Text>
                            <View className="flex-row items-center mt-2">
                                <View className="bg-primary/10 px-2 py-0.5 rounded border border-primary/20 mr-2">
                                    <Text className="text-primary text-[10px] font-bold">已認證員工</Text>
                                </View>
                                <Text className="text-muted-foreground text-xs">ID: 9527</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-card p-2 rounded-full border border-border">
                            <ChevronRight size={20} color={isDarkMode ? '#F4F4F5' : '#71717A'}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1 px-5" contentContainerStyle={{paddingBottom: 100}}>

                    {/* === 系統設定 === */}
                    <Text
                        className="text-muted-foreground text-xs font-bold mt-6 mb-3 uppercase tracking-wider">系統偏好</Text>

                    <View className="bg-card rounded-2xl overflow-hidden border border-border">
                        {/* 深色模式切換 */}
                        <View className="flex-row items-center justify-between p-4 border-b border-border">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-lg bg-purple-500/20 items-center justify-center mr-3">
                                    <Moon size={18} color={isDarkMode ? '#C084FC' : '#9333EA'}/>
                                </View>
                                <Text className="text-foreground font-medium text-base">深色模式</Text>
                            </View>

                            {/* 綁定切換功能 */}
                            <Switch
                                value={isDarkMode}
                                onValueChange={toggleColorScheme}
                            />
                        </View>

                        {/* 字體設定 (Demo) */}
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-lg bg-blue-500/20 items-center justify-center mr-3">
                                    <Type size={18} color={'#60A5FA'}/>
                                </View>
                                <View>
                                    <Text className="text-foreground font-medium text-base">字體大小與樣式</Text>
                                    <Text className="text-muted-foreground text-xs">目前設定：標準 (預設)</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color={isDarkMode ? '#D4D4D8' : '#71717A'}/>
                        </TouchableOpacity>

                        {/* 通知設定 */}
                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-lg bg-red-500/20 items-center justify-center mr-3">
                                    <Bell size={18} color={'#F87171'}/>
                                </View>
                                <Text className="text-foreground font-medium text-base">推播通知</Text>
                            </View>
                            <Switch
                                value={isNotifEnabled}
                                onValueChange={setIsNotifEnabled}
                            />
                        </View>
                    </View>

                    {/* === 帳號維護 === */}
                    <Text
                        className="text-muted-foreground text-xs font-bold mt-6 mb-3 uppercase tracking-wider">帳號安全</Text>

                    <View className="bg-card rounded-2xl overflow-hidden border border-border">
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-lg bg-green-500/20 items-center justify-center mr-3">
                                    <Lock size={18} color={'#4ADE80'}/>
                                </View>
                                <Text className="text-foreground font-medium text-base">修改密碼</Text>
                            </View>
                            <ChevronRight size={18} color={isDarkMode ? '#D4D4D8' : '#71717A'}/>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-lg bg-orange-500/20 items-center justify-center mr-3">
                                    <Smartphone size={18} color={'#FB923C'}/>
                                </View>
                                <View>
                                    <Text className="text-foreground font-medium text-base">綁定手機</Text>
                                    <Text className="text-muted-foreground text-xs">0975-***-887</Text>
                                </View>
                            </View>
                            <View className="bg-green-500/10 px-2 py-1 rounded">
                                <Text className="text-green-500 text-[10px] font-bold">已綁定</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* === 關於 === */}
                    <Text
                        className="text-muted-foreground text-xs font-bold mt-6 mb-3 uppercase tracking-wider">關於</Text>

                    <View className="bg-card rounded-2xl overflow-hidden border border-border mb-6">
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border">
                            <View className="flex-row items-center">
                                <FileText size={18} color={isDarkMode ? '#D4D4D8' : '#71717A'} mr-3/>
                                <Text className="text-foreground font-medium text-base">隱私權條款</Text>
                            </View>
                            <ChevronRight size={18} color={isDarkMode ? '#D4D4D8' : '#71717A'}/>
                        </TouchableOpacity>

                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center">
                                <Text className="text-muted-foreground font-medium text-base">版本資訊</Text>
                            </View>
                            <Text className="text-muted-foreground text-sm">v1.0.0 (Build 20251221)</Text>
                        </View>
                    </View>

                    {/* === 登出 === */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-red-500/10 border border-red-500/20 p-4 rounded-2xl active:bg-red-500/20">
                        <LogOut size={20} color={'#EF4444'} mr-2/>
                        <Text className="text-red-500 font-bold text-base">登出帳號</Text>
                    </TouchableOpacity>

                    <Text className="text-muted-foreground text-xs text-center mt-6">
                        FU-MAO CONSTRUCTION © 2025
                    </Text>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}