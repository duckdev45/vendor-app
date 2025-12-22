import {View, Text, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState} from 'react';
import {
    User, Type, Bell, Moon, Lock, FileText, LogOut, ChevronRight, Smartphone, Minus, Plus
} from 'lucide-react-native';
import {useColorScheme} from 'nativewind';
import {usePreferences} from '@/context/preferences-context';

export default function AccountScreen() {
    const {colorScheme, toggleColorScheme} = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const [isNotifEnabled, setIsNotifEnabled] = useState(true);

    // 取得字體控制權
    const {fontScale, setFontScale} = usePreferences();

    // 調整邏輯：範圍 0.8x ~ 1.6x
    const increaseFont = () => {
        if (fontScale < 1.6) setFontScale(Math.round((fontScale + 0.1) * 10) / 10);
    };

    const decreaseFont = () => {
        if (fontScale > 0.8) setFontScale(Math.round((fontScale - 0.1) * 10) / 10);
    };

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
                            <Switch value={isDarkMode} onValueChange={toggleColorScheme}/>
                        </View>

                        {/* 🔥 字體大小調整 (Grandpa Mode) */}
                        <View className="p-4 border-b border-border">
                            <View className="flex-row items-center mb-3">
                                <View className="w-8 h-8 rounded-lg bg-blue-500/20 items-center justify-center mr-3">
                                    <Type size={18} color={'#60A5FA'}/>
                                </View>
                                <View>
                                    <Text className="text-foreground font-medium text-base">字體大小</Text>
                                    <Text className="text-muted-foreground text-xs">
                                        目前倍率：{fontScale.toFixed(1)}x {fontScale >= 1.4 ? '(阿公模式 👴)' : ''}
                                    </Text>
                                </View>
                            </View>

                            {/* 控制按鈕列 */}
                            <View className="flex-row items-center justify-between bg-muted/50 rounded-xl p-2">
                                <TouchableOpacity
                                    onPress={decreaseFont}
                                    className="w-10 h-10 bg-card rounded-lg items-center justify-center border border-border active:scale-95"
                                >
                                    <Minus size={20} color={isDarkMode ? '#FFFFFF' : '#000000'}/>
                                </TouchableOpacity>

                                <View className="flex-row items-end flex-1 justify-center">
                                    <Text className="text-muted-foreground text-xs font-bold mb-1 mr-2">A</Text>
                                    {/* 進度條顯示 */}
                                    <View
                                        className="h-1 bg-border w-24 rounded-full mx-2 overflow-hidden flex-row items-center">
                                        <View
                                            style={{width: `${((fontScale - 0.8) / 0.8) * 100}%`}}
                                            className="h-full bg-primary"
                                        />
                                    </View>
                                    <Text className="text-foreground text-lg font-bold ml-2">A</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={increaseFont}
                                    className="w-10 h-10 bg-card rounded-lg items-center justify-center border border-border active:scale-95"
                                >
                                    <Plus size={20} color={isDarkMode ? '#FFFFFF' : '#000000'}/>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 通知設定 */}
                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-lg bg-red-500/20 items-center justify-center mr-3">
                                    <Bell size={18} color={'#F87171'}/>
                                </View>
                                <Text className="text-foreground font-medium text-base">推播通知</Text>
                            </View>
                            <Switch value={isNotifEnabled} onValueChange={setIsNotifEnabled}/>
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