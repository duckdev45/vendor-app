import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
    Bell,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    FileText
} from 'lucide-react-native';

// 模擬通知數據
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'defect', // defect, task, system
        title: '缺失改善通知',
        desc: '中庄二 11F-A1 陽台防水層破損，請於三日內修復完畢。',
        time: '剛剛',
        isUnread: true,
        project: '中庄二',
    },
    {
        id: '2',
        type: 'task',
        title: '查驗通過通知',
        desc: '翠屏三 RF 防水試水紀錄已審核通過，可進行下一道工序。',
        time: '2小時前',
        isUnread: true,
        project: '翠屏三',
    },
    {
        id: '3',
        type: 'defect',
        title: '缺失複驗未過',
        desc: '中庄二 1F 大廳地磚填縫不實，請重新施作。',
        time: '昨天 16:30',
        isUnread: false,
        project: '中庄二',
    },
    {
        id: '4',
        type: 'system',
        title: '系統公告',
        desc: '系統將於 12/25 02:00-04:00 進行維護，屆時將無法上傳照片。',
        time: '昨天 09:00',
        isUnread: false,
        project: '系統',
    },
    {
        id: '5',
        type: 'task',
        title: '新任務指派',
        desc: '您已被加入「中庄二 B1 機電配置」工項群組。',
        time: '12/20',
        isUnread: false,
        project: '中庄二',
    },
];

export default function NotificationScreen() {
    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1">
                {/* === Header === */}
                <View className="px-5 pt-2 pb-4 border-b border-border bg-background">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Bell size={24} className="text-primary mr-2"/>
                            <Text className="text-foreground text-2xl font-bold">通知中心</Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-muted-foreground text-sm">全部已讀</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* === Notification List === */}
                <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{paddingBottom: 100}}>
                    {MOCK_NOTIFICATIONS.map((item, index) => (
                        <View key={item.id} className="flex-row mb-6 relative">
                            {/* 左側時間軸線 (最後一個不顯示線) */}
                            {index !== MOCK_NOTIFICATIONS.length - 1 && (
                                <View className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-border"/>
                            )}

                            {/* 左側 Icon */}
                            <View
                                className={`w-10 h-10 rounded-full items-center justify-center border-4 border-background z-10 mr-3 ${
                                    item.type === 'defect' ? 'bg-red-500/20' :
                                        item.type === 'task' ? 'bg-green-500/20' : 'bg-blue-500/20'
                                }`}>
                                {item.type === 'defect' && <AlertTriangle size={18} className="text-red-500"/>}
                                {item.type === 'task' && <CheckCircle2 size={18} className="text-green-500"/>}
                                {item.type === 'system' && <FileText size={18} className="text-blue-500"/>}
                            </View>

                            {/* 右側內容卡片 */}
                            <TouchableOpacity className={`flex-1 rounded-2xl p-4 border ${
                                item.isUnread ? 'bg-card border-border' : 'bg-transparent border-border/80'
                            }`}>
                                <View className="flex-row justify-between items-start mb-1">
                                    <View className="flex-row items-center">
                                        <Text className={`font-bold text-base mr-2 ${
                                            item.type === 'defect' ? 'text-red-500' : 'text-foreground'
                                        }`}>
                                            {item.title}
                                        </Text>
                                        {item.isUnread && (
                                            <View className="w-2 h-2 rounded-full bg-primary"/>
                                        )}
                                    </View>
                                    <Text className="text-muted-foreground text-xs">{item.time}</Text>
                                </View>

                                <Text className="text-muted-foreground text-sm leading-relaxed mb-3">
                                    {item.desc}
                                </Text>

                                <View
                                    className="flex-row justify-between items-center pt-3 border-t border-border/50">
                                    <View className="bg-muted px-2 py-1 rounded text-xs">
                                        <Text className="text-muted-foreground text-[10px] font-bold">{item.project}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="text-muted-foreground text-xs mr-1">查看詳情</Text>
                                        <ChevronRight size={12} className="text-muted-foreground"/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}