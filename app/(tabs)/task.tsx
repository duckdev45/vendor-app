import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
    MapPin,
    CheckCircle2,
    AlertCircle,
    Clock,
    ChevronRight,
    ClipboardList,
    Building2
} from 'lucide-react-native';
import {useColorScheme} from "nativewind";

// 模擬廠商的待辦任務數據
const MOCK_TASKS = [
    {
        id: '1',
        project: '中庄二',
        location: '11F - A1 戶',
        title: '連續壁鋼筋查驗',
        date: '2025-12-21',
        deadline: '17:00',
        status: 'urgent', // urgent, pending, done
        type: '結構工程',
    },
    {
        id: '2',
        project: '中庄二',
        location: '11F - A2 戶',
        title: '模板組立查驗',
        date: '2025-12-21',
        deadline: '18:00',
        status: 'pending',
        type: '結構工程',
    },
    {
        id: '3',
        project: '翠屏三',
        location: 'RF (屋突層)',
        title: '防水試水紀錄 (48hr)',
        date: '2025-12-22',
        deadline: '09:00',
        status: 'pending',
        type: '防水工程',
    },
    {
        id: '4',
        project: '中庄二',
        location: 'B1 - 公共區域',
        title: '消防管線配置查驗',
        date: '2025-12-20',
        deadline: '已完成',
        status: 'done',
        type: '機電工程',
    },
    {
        id: '5',
        project: '中庄二',
        location: '1F - 大廳',
        title: '地磚鋪設進度回報',
        date: '2025-12-19',
        deadline: '已完成',
        status: 'done',
        type: '裝修工程',
    },
];

export default function TaskScreen() {
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1">
                {/* === Header === */}
                <View className="px-5 pt-2 pb-4 border-b border-border bg-background">
                    <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center">
                            <ClipboardList size={24} color={isDark ? '#FBBF24' : '#F59E0B'} style={{marginRight: 8}}/>
                            <Text className="text-foreground text-2xl font-bold">任務清單</Text>
                        </View>
                        {/*<TouchableOpacity className="bg-muted p-2 rounded-full border border-border">*/}
                        {/*    <Filter size={20} className="text-muted-foreground"/>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    <Text className="text-muted-foreground text-sm">
                        今日還有 <Text className="text-primary font-bold">2</Text> 項急件需處理
                    </Text>
                </View>

                {/* === Task List === */}
                <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{paddingBottom: 100}}>

                    {/* 分類標題：待處理 */}
                    <Text
                        className="text-muted-foreground text-xs font-bold mb-3 uppercase tracking-wider">待處理事項</Text>

                    {MOCK_TASKS.filter(t => t.status !== 'done').map((task) => (
                        <TouchableOpacity
                            key={task.id}
                            className={`mb-4 rounded-2xl border p-4 ${
                                task.status === 'urgent'
                                    ? 'bg-amber-500/10 border-amber-500/50'
                                    : 'bg-card border-border'
                            }`}
                        >
                            {/* 標籤列 */}
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-row items-center bg-muted px-2 py-1 rounded text-xs">
                                    <Building2 size={10} className="text-muted-foreground mr-1"/>
                                    <Text className="text-muted-foreground text-[10px] font-bold">{task.project}</Text>
                                </View>
                                {task.status === 'urgent' && (
                                    <View
                                        className="bg-red-500/20 px-2 py-1 rounded border border-red-500/30 flex-row items-center">
                                        <AlertCircle size={10} className="text-red-400 mr-1"/>
                                        <Text className="text-red-400 text-[10px] font-bold">急件</Text>
                                    </View>
                                )}
                            </View>

                            {/* 主要內容 */}
                            <Text className="text-foreground text-lg font-bold mb-1">{task.title}</Text>

                            <View className="flex-row items-center mb-4">
                                <MapPin size={14} className="text-muted-foreground mr-1"/>
                                <Text className="text-muted-foreground text-sm">{task.location}</Text>
                            </View>

                            {/* 底部資訊：時間與按鈕 */}
                            <View className="flex-row justify-between items-center pt-3 border-t border-border/70">
                                <View className="flex-row items-center">
                                    <Clock size={14}
                                           className={task.status === 'urgent' ? 'text-primary' : 'text-muted-foreground'}
                                           style={{marginRight: 6}}/>
                                    <Text
                                        className={`text-xs ${task.status === 'urgent' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                        期限：{task.date} {task.deadline}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-muted-foreground text-xs mr-1">上傳回報</Text>
                                    <ChevronRight size={14} className="text-muted-foreground"/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {/* 分類標題：已完成 */}
                    <Text
                        className="text-muted-foreground text-xs font-bold mb-3 mt-4 uppercase tracking-wider">已完成紀錄</Text>

                    {MOCK_TASKS.filter(t => t.status === 'done').map((task) => (
                        <TouchableOpacity
                            key={task.id}
                            className="bg-card/50 border border-border/50 p-4 rounded-2xl mb-3 opacity-60"
                        >
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-muted-foreground font-bold text-base">{task.title}</Text>
                                <CheckCircle2 size={18} className="text-green-500"/>
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-muted-foreground text-xs mr-3">{task.project}</Text>
                                <Text className="text-muted-foreground text-xs">| {task.location}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}