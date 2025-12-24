// import {View, Text, ScrollView, TouchableOpacity, Platform, UIManager, LayoutAnimation} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {useState} from 'react';
// import {
//     MapPin,
//     CheckCircle2,
//     AlertCircle,
//     Clock,
//     ClipboardList,
//     ArrowUpRight,
//     Filter,
//     ChevronDown,
//     ChevronUp
// } from 'lucide-react-native';
// import {useColorScheme} from "nativewind";
//
// // 啟用 Android 的 LayoutAnimation
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }
//
// // 模擬依建案分組的任務數據
// const PROJECT_TASKS = [
//     {
//         projectId: 'p1',
//         projectName: '中庄二',
//         progress: 75,
//         tasks: [
//             {
//                 id: '1',
//                 title: '連續壁鋼筋查驗',
//                 location: '11F - A1 戶',
//                 deadline: '今日 17:00',
//                 status: 'urgent',
//                 assignee: '王小明',
//                 type: '結構工程',
//             },
//             {
//                 id: '2',
//                 title: '模板組立查驗',
//                 location: '11F - A2 戶',
//                 deadline: '今日 18:00',
//                 status: 'pending',
//                 assignee: '李大華',
//                 type: '結構工程',
//             },
//             {
//                 id: '4',
//                 title: '消防管線配置查驗',
//                 location: 'B1 - 公共區域',
//                 deadline: '12/20 完成',
//                 status: 'done',
//                 assignee: '陳志豪',
//                 type: '機電工程',
//             },
//             {
//                 id: '5',
//                 title: '地磚鋪設進度回報',
//                 location: '1F - 大廳',
//                 deadline: '12/19 完成',
//                 status: 'done',
//                 assignee: '林美玲',
//                 type: '裝修工程',
//             },
//         ]
//     },
//     {
//         projectId: 'p2',
//         projectName: '翠屏三',
//         progress: 30,
//         tasks: [
//             {
//                 id: '3',
//                 title: '防水試水紀錄 (48hr)',
//                 location: 'RF (屋突層)',
//                 deadline: '明日 09:00',
//                 status: 'pending',
//                 assignee: '張建國',
//                 type: '防水工程',
//             },
//             {
//                 id: '6',
//                 title: '鷹架搭設檢查',
//                 location: '外牆全區',
//                 deadline: '12/18 完成',
//                 status: 'done',
//                 assignee: '劉阿土',
//                 type: '安衛檢查',
//             }
//         ]
//     }
// ];
//
// export default function TaskScreen() {
//     const {colorScheme} = useColorScheme();
//     const isDark = colorScheme === 'dark';
//
//     // 控制收合的狀態 (記錄被收起來的 projectId)
//     const [collapsedProjects, setCollapsedProjects] = useState<Record<string, boolean>>({});
//
//     // 切換收合函式
//     const toggleProject = (projectId: string) => {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         setCollapsedProjects(prev => ({
//             ...prev,
//             [projectId]: !prev[projectId]
//         }));
//     };
//
//     // 狀態渲染 Helper
//     const renderStatusIcon = (status: string) => {
//         switch (status) {
//             case 'urgent':
//                 return <AlertCircle size={18} className="text-red-500 fill-red-500/10"/>;
//             case 'pending':
//                 return <Clock size={18} className="text-amber-500 fill-amber-500/10"/>;
//             case 'done':
//                 return <CheckCircle2 size={18} className="text-green-500 fill-green-500/10"/>;
//             default:
//                 return <CheckCircle2 size={18} className="text-muted-foreground"/>;
//         }
//     };
//
//     const getStatusText = (status: string) => {
//         switch (status) {
//             case 'urgent':
//                 return '急件';
//             case 'pending':
//                 return '進行中';
//             case 'done':
//                 return '已完成';
//             default:
//                 return '未知';
//         }
//     };
//
//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'urgent':
//                 return 'text-red-500 border-red-500/30 bg-red-500/10';
//             case 'pending':
//                 return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
//             case 'done':
//                 return 'text-green-500 border-green-500/30 bg-green-500/10';
//             default:
//                 return 'text-muted-foreground border-border bg-muted';
//         }
//     };
//
//     return (
//         <View className="flex-1 bg-background">
//             <SafeAreaView className="flex-1">
//                 {/* === Header === */}
//                 <View className="px-5 pt-2 pb-4 border-b border-border bg-background z-10">
//                     <View className="flex-row justify-between items-center">
//                         <View className="flex-row items-center">
//                             <ClipboardList size={24} color={isDark ? '#FBBF24' : '#F59E0B'} style={{marginRight: 8}}/>
//                             <Text className="text-foreground text-2xl font-bold">建案看板</Text>
//                         </View>
//                         <TouchableOpacity className="bg-muted p-2 rounded-full border border-border">
//                             <Filter size={20} className="text-muted-foreground"/>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//
//                 {/* === Project List === */}
//                 <ScrollView className="flex-1" contentContainerStyle={{paddingBottom: 100}}>
//                     {PROJECT_TASKS.map((project) => {
//                         // 判斷目前是否為收合狀態
//                         const isCollapsed = collapsedProjects[project.projectId];
//
//                         return (
//                             <View key={project.projectId} className="mb-4">
//
//                                 {/* L1: Project Header (可點擊收合) */}
//                                 <TouchableOpacity
//                                     activeOpacity={0.8}
//                                     onPress={() => toggleProject(project.projectId)}
//                                     className="px-5 py-4 bg-muted/30 border-y border-border/50 sticky top-0 backdrop-blur-md flex-row justify-between items-center"
//                                 >
//                                     <View>
//                                         <View className="flex-row items-center mb-1">
//                                             <Text className="text-foreground font-bold text-lg tracking-wide">
//                                                 {project.projectName}
//                                             </Text>
//                                         </View>
//                                     </View>
//
//                                     {/* 右側資訊：進度 + 收合箭頭 */}
//                                     <View className="items-end">
//                                         <View className="flex-row items-center mb-1">
//                                             <Text className="text-muted-foreground text-xs font-medium mr-2">
//                                                 總進度 {project.progress}%
//                                             </Text>
//                                             <View className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
//                                                 <View style={{width: `${project.progress}%`}}
//                                                       className="h-full bg-primary"/>
//                                             </View>
//                                         </View>
//
//                                         {/* 顯示還有幾個任務 */}
//                                         <View className="flex-row items-center mt-1">
//                                             {isCollapsed && (
//                                                 <View className="bg-primary/10 px-2 py-0.5 rounded-full mr-2">
//                                                     <Text className="text-primary text-[10px] font-bold">
//                                                         {project.tasks.length} 個任務
//                                                     </Text>
//                                                 </View>
//                                             )}
//                                             {isCollapsed ?
//                                                 <ChevronDown size={20} className="text-muted-foreground"/> :
//                                                 <ChevronUp size={20} className="text-muted-foreground"/>
//                                             }
//                                         </View>
//                                     </View>
//                                 </TouchableOpacity>
//
//                                 {/* L2: Task Timeline (根據狀態顯示/隱藏) */}
//                                 {!isCollapsed && (
//                                     <View className="px-4 pt-4">
//                                         {project.tasks.map((task, tIndex) => (
//                                             <View key={task.id} className="flex-row mb-2 relative">
//
//                                                 {/* 時間軸貫穿線 */}
//                                                 {tIndex !== project.tasks.length - 1 && (
//                                                     <View
//                                                         className="absolute left-[23px] top-10 bottom-[-10px] w-[2px] bg-border/40"/>
//                                                 )}
//
//                                                 {/* 左側狀態節點 */}
//                                                 <View className="mr-3 pt-4 items-center w-12">
//                                                     <View className={`p-1.5 rounded-full border-2 ${
//                                                         task.status === 'done' ? 'border-border bg-muted' :
//                                                             task.status === 'urgent' ? 'border-red-500/20 bg-red-500/10' :
//                                                                 'border-amber-500/20 bg-amber-500/10'
//                                                     } bg-background z-10 shadow-sm`}>
//                                                         {renderStatusIcon(task.status)}
//                                                     </View>
//                                                 </View>
//
//                                                 {/* 右側任務卡片 */}
//                                                 <TouchableOpacity
//                                                     activeOpacity={0.7}
//                                                     className={`flex-1 rounded-2xl border p-4 mb-3 ${
//                                                         task.status === 'done'
//                                                             ? 'bg-muted/30 border-border/50 opacity-70'
//                                                             : 'bg-card border-border shadow-sm'
//                                                     }`}
//                                                 >
//                                                     <View className="flex-row justify-between items-start mb-2">
//                                                         {/* 標籤 */}
//                                                         <View className="flex-row gap-2">
//                                                             <View
//                                                                 className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(task.status)}`}>
//                                                                 <Text
//                                                                     className={getStatusColor(task.status).split(' ')[0]}>
//                                                                     {getStatusText(task.status)}
//                                                                 </Text>
//                                                             </View>
//                                                             <View
//                                                                 className="bg-muted px-2 py-0.5 rounded border border-border">
//                                                                 <Text
//                                                                     className="text-muted-foreground text-[10px]">{task.type}</Text>
//                                                             </View>
//                                                         </View>
//
//                                                         {/* 期限 */}
//                                                         <View className="flex-row items-center">
//                                                             <Clock size={12}
//                                                                    className={task.status === 'urgent' ? "text-red-500 mr-1" : "text-muted-foreground mr-1"}/>
//                                                             <Text
//                                                                 className={`text-xs ${task.status === 'urgent' ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
//                                                                 {task.deadline}
//                                                             </Text>
//                                                         </View>
//                                                     </View>
//
//                                                     {/* 標題與位置 */}
//                                                     <Text
//                                                         className={`text-lg font-bold mb-1 ${task.status === 'done' ? 'text-muted-foreground line-through decoration-border' : 'text-foreground'}`}>
//                                                         {task.title}
//                                                     </Text>
//
//                                                     <View className="flex-row items-center justify-between mt-1">
//                                                         <View className="flex-row items-center">
//                                                             <MapPin size={14} className="text-muted-foreground mr-1"/>
//                                                             <Text
//                                                                 className="text-muted-foreground text-sm">{task.location}</Text>
//                                                         </View>
//
//                                                         {task.status !== 'done' ? (
//                                                             <View className="flex-row items-center">
//                                                                 <Text
//                                                                     className="text-primary text-xs font-bold mr-1">上傳回報</Text>
//                                                                 <ArrowUpRight size={14} className="text-primary"/>
//                                                             </View>
//                                                         ) : (
//                                                             <Text
//                                                                 className="text-muted-foreground text-xs">負責人: {task.assignee}</Text>
//                                                         )}
//                                                     </View>
//                                                 </TouchableOpacity>
//                                             </View>
//                                         ))}
//                                     </View>
//                                 )}
//                             </View>
//                         );
//                     })}
//                 </ScrollView>
//             </SafeAreaView>
//         </View>
//     );
// }