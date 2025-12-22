import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Mic, ArrowRight, Activity, CalendarClock} from 'lucide-react-native';

export default function HomeScreen() {
    return (
        <View className="flex-1 bg-background">
            {/* 背景光暈效果 */}
            <View className="absolute top-0 left-0 right-0 h-[500px] opacity-20">
                <View className="w-full h-full bg-amber-600 rounded-b-full scale-150 -mt-40 blur-3xl"/>
            </View>

            <SafeAreaView className="flex-1">
                <ScrollView className="px-6" contentContainerStyle={{paddingBottom: 120}}>

                    {/*/!* Header *!/*/}
                    {/*<View className="flex-row justify-between items-center mt-4 mb-8">*/}
                    {/*    <View>*/}
                    {/*        <Text className="text-muted-foreground text-sm font-medium uppercase tracking-wider">*/}
                    {/*            Welcome back,*/}
                    {/*        </Text>*/}
                    {/*        <Text className="text-foreground text-3xl font-bold mt-1">*/}
                    {/*            duck<Text className="text-primary">.</Text>*/}
                    {/*        </Text>*/}
                    {/*    </View>*/}
                    {/*    <TouchableOpacity className="w-10 h-10 rounded-full bg-card items-center justify-center border border-border">*/}
                    {/*        <User size={20} className="text-muted-foreground" />*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}

                    {/* 視覺卡片 */}
                    <View
                        className="w-full aspect-[4/5] bg-card/80 rounded-[40px] border border-border overflow-hidden relative mb-8">
                        {/* 卡片內的裝飾光暈 */}
                        <View
                            className="absolute top-1/2 left-1/2 -ml-32 -mt-32 w-64 h-64 bg-primary/20 rounded-full blur-[60px]"/>

                        <View className="flex-1 p-8 justify-between">
                            {/* 頂部圖示 */}
                            <View className="flex-row justify-between items-start">
                                <View
                                    className="w-12 h-12 rounded-full bg-foreground/10 items-center justify-center backdrop-blur-md">
                                    <Activity size={24} className="text-primary"/>
                                </View>
                                <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                    <Text className="text-primary text-xs font-bold">AI Assistant</Text>
                                </View>
                            </View>

                            {/* 中間文字 */}
                            <View>
                                <Text className="text-foreground text-3xl font-light leading-tight">
                                    Schedule a <Text className="font-bold text-primary">site inspection</Text>
                                    {'\n'}for B-Block
                                </Text>
                                <Text className="text-muted-foreground mt-2 text-lg">
                                    Tuesday at 3 PM
                                </Text>
                            </View>

                            {/* 底部按鈕 (模擬語音輸入) */}
                            <View className="flex-row items-center gap-4">
                                <TouchableOpacity
                                    className="w-16 h-16 rounded-full bg-primary items-center justify-center shadow-lg shadow-primary/30">
                                    <Mic size={28} className="text-primary-foreground"/>
                                </TouchableOpacity>
                                <View className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                                    <View className="h-full w-1/3 bg-muted-foreground/30 rounded-full"/>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* 下方功能列表 */}
                    <Text className="text-foreground text-lg font-bold mb-4 ml-1">Recent Tasks</Text>

                    <TouchableOpacity
                        className="flex-row items-center bg-card p-5 rounded-3xl mb-4 border border-border">
                        <View className="w-12 h-12 rounded-2xl bg-muted items-center justify-center mr-4">
                            <CalendarClock size={24} className="text-muted-foreground"/>
                        </View>
                        <View className="flex-1">
                            <Text className="text-foreground font-semibold text-lg">連續壁工程</Text>
                            <Text className="text-muted-foreground text-sm">Today, 2:00 PM</Text>
                        </View>
                        <ArrowRight size={20} className="text-muted-foreground"/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center bg-card p-5 rounded-3xl mb-4 border border-border">
                        <View className="w-12 h-12 rounded-2xl bg-muted items-center justify-center mr-4">
                            <Activity size={24} className="text-muted-foreground"/>
                        </View>
                        <View className="flex-1">
                            <Text className="text-foreground font-semibold text-lg">安全支撐檢查</Text>
                            <Text className="text-muted-foreground text-sm">Yesterday</Text>
                        </View>
                        <ArrowRight size={20} className="text-muted-foreground"/>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}