import {View, Text, ScrollView, TouchableOpacity, Image, Modal, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState} from 'react';
import {
    Calendar,
    MapPin,
    X,
    Images,
    MoreHorizontal,
    ChevronDown,
    ChevronUp
} from 'lucide-react-native';
import {useColorScheme} from "nativewind";

// 取得螢幕寬度來計算九宮格尺寸
const {width: SCREEN_WIDTH} = Dimensions.get('window');
// 卡片內縮 padding (px-4 = 16px, 左右共 32px) + 左側時間軸空間 (w-14 = 56px, mr-3 = 12px) + 卡片內部 padding (p-4 = 16px * 2 = 32px)
const CONTENT_WIDTH = SCREEN_WIDTH - 32 - 68 - 32;
const GRID_GAP = 6;
const IMAGE_SIZE = (CONTENT_WIDTH - (GRID_GAP * 2)) / 3;

// 產生模擬圖片陣列的 Helper
const generateImages = (count: number) => {
    const baseImages = [
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400&auto=format&fit=crop',
    ];
    return Array.from({length: count}).map((_, i) => baseImages[i % baseImages.length]);
};

// 模擬動態牆數據
const MOCK_TIMELINE = [
    {
        date: '2025年12月23日 (二)',
        items: [
            {
                id: '1',
                project: '大學27街',
                location: 'B2F - 全樓層',
                item: '連續壁鋼筋查驗',
                time: '14:30',
                status: 'pending',
                images: generateImages(12),
                description: '鋼筋間距已修正，共補拍 12 張細節圖供確認。'
            },
            {
                id: '2',
                project: '中庄二',
                location: '1F 大廳',
                item: '地磚鋪設',
                time: '10:15',
                status: 'verified',
                images: generateImages(4),
                description: '大廳地磚平整度檢查完畢，泥作退場。'
            }
        ]
    },
    {
        date: '2025年12月22日 (一)',
        items: [
            {
                id: '3',
                project: '翠屏三',
                location: 'RF 屋突層',
                item: '防水試水紀錄 (48hr)',
                time: '16:45',
                status: 'verified',
                images: generateImages(1),
                description: '試水紀錄 Day 1，無滲漏現象，水位無明顯下降。'
            }
        ]
    }
];

export default function GalleryScreen() {
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // 控制哪些卡片已經展開 (id map)
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => ({...prev, [id]: !prev[id]}));
    };

    // 渲染狀態標籤 (簡化版，只顯示圓點顏色，避免搶視覺)
    const renderStatus = (status: string) => {
        // 這裡我們把狀態做得更像時間軸上的節點
        if (status === 'verified') return <View
            className="w-3 h-3 rounded-full bg-green-500 border-2 border-card shadow-sm"/>;
        if (status === 'pending') return <View
            className="w-3 h-3 rounded-full bg-amber-500 border-2 border-card shadow-sm"/>;
        return <View className="w-3 h-3 rounded-full bg-red-500 border-2 border-card shadow-sm"/>;
    };

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView className="flex-1">
                {/* === Header === */}
                <View className="px-5 pt-2 pb-4 border-b border-border bg-background z-10">
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <Images size={24} color={isDark ? '#FBBF24' : '#F59E0B'} style={{marginRight: 8}}/>
                            <Text className="text-foreground text-2xl font-bold">工程動態</Text>
                        </View>
                        <TouchableOpacity className="bg-muted p-2 rounded-full border border-border">
                            <Calendar size={20} className="text-muted-foreground"/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* === Timeline ScrollView === */}
                <ScrollView className="flex-1" contentContainerStyle={{paddingBottom: 100}}>
                    {MOCK_TIMELINE.map((section, sectionIndex) => (
                        <View key={sectionIndex} className="mb-2">

                            {/* 日期標題 (更簡潔的設計) */}
                            <View
                                className="px-5 py-4 flex-row items-center sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                                <View className="w-1 h-4 rounded-full bg-primary mr-3"/>
                                <Text className="text-foreground font-bold text-base tracking-wide">
                                    {section.date}
                                </Text>
                            </View>

                            <View className="px-4">
                                {section.items.map((item, index) => {
                                    const isExpanded = expandedItems[item.id];
                                    const displayImages = isExpanded ? item.images : item.images.slice(0, 9);
                                    const remainingCount = item.images.length - 9;

                                    return (
                                        <View key={item.id} className="flex-row mb-6 relative">

                                            {/* 左側時間軸線 (貫穿線) */}
                                            {index !== section.items.length - 1 && (
                                                <View
                                                    className="absolute left-[26px] top-8 bottom-[-40px] w-[2px] bg-border/40"/>
                                            )}

                                            {/* 左側時間與節點 */}
                                            <View className="items-center mr-4 w-14 pt-1">
                                                <Text className="text-foreground font-bold text-base">{item.time}</Text>
                                                {/* 狀態節點直接整合在時間下方 */}
                                                <View className="mt-2 relative">
                                                    {renderStatus(item.status)}
                                                </View>
                                            </View>

                                            {/* 右側內容卡片 (優化版) */}
                                            <View
                                                className="flex-1 bg-card rounded-2xl border border-border p-4 shadow-sm">

                                                {/* 建案名稱標籤 (Badge Style) */}
                                                <View className="flex-row justify-between items-start mb-3">
                                                    <View
                                                        className="bg-primary/10 px-3 py-1 rounded-md border border-primary/20 self-start">
                                                        <View className="flex-row items-center">
                                                            <Text
                                                                className="text-primary text-xs font-bold tracking-wide">
                                                                {item.project}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <TouchableOpacity className="p-1 -mr-2">
                                                        <MoreHorizontal size={20} className="text-muted-foreground/50"/>
                                                    </TouchableOpacity>
                                                </View>

                                                {/* 🔥 優化 2: 大標題與位置資訊整合 */}
                                                {/* 標題加大，位置放在標題下方，使用灰色弱化，形成對比 */}
                                                <View className="mb-4">
                                                    <Text
                                                        className="text-foreground font-bold text-lg mb-1 leading-tight">
                                                        {item.item}
                                                    </Text>
                                                    <View className="flex-row items-center">
                                                        <MapPin size={14} className="text-muted-foreground mr-1"/>
                                                        <Text className="text-muted-foreground text-sm font-medium">
                                                            {item.location}
                                                        </Text>
                                                    </View>
                                                </View>

                                                {/* 3. Photo Grid (Instagram Style) */}
                                                <View className="flex-row flex-wrap rounded-xl overflow-hidden"
                                                      style={{gap: GRID_GAP}}>
                                                    {displayImages.map((imgUri, imgIndex) => {
                                                        const isLastThumbnail = !isExpanded && imgIndex === 8 && remainingCount > 0;

                                                        return (
                                                            <TouchableOpacity
                                                                key={imgIndex}
                                                                activeOpacity={0.8}
                                                                onPress={() => {
                                                                    if (isLastThumbnail) {
                                                                        toggleExpand(item.id);
                                                                    } else {
                                                                        setPreviewImage(imgUri);
                                                                    }
                                                                }}
                                                                style={{
                                                                    width: IMAGE_SIZE,
                                                                    height: IMAGE_SIZE,
                                                                    // 圓角處理：只有角落的圖片有圓角
                                                                    borderRadius: 4,
                                                                    overflow: 'hidden',
                                                                    position: 'relative'
                                                                }}
                                                            >
                                                                <Image
                                                                    source={{uri: imgUri}}
                                                                    style={{width: '100%', height: '100%'}}
                                                                    resizeMode="cover"
                                                                />

                                                                {/* +N 遮罩層 */}
                                                                {isLastThumbnail && (
                                                                    <View
                                                                        className="absolute inset-0 bg-black/60 justify-center items-center">
                                                                        <Text className="text-white font-bold text-lg">
                                                                            +{remainingCount}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>

                                                {/* 4. Description & Toggle */}
                                                <View
                                                    className="mt-3 pt-3 border-t border-border/40 flex-row justify-between items-start">
                                                    <Text
                                                        className="text-muted-foreground text-sm flex-1 mr-4 leading-relaxed"
                                                        numberOfLines={isExpanded ? undefined : 2}>
                                                        {item.description}
                                                    </Text>
                                                    {item.images.length > 9 && (
                                                        <TouchableOpacity
                                                            onPress={() => toggleExpand(item.id)}
                                                            className="flex-row items-center pt-0.5"
                                                        >
                                                            <Text className="text-primary text-xs font-bold mr-1">
                                                                {isExpanded ? '收起' : '展開'}
                                                            </Text>
                                                            {isExpanded ?
                                                                <ChevronUp size={14} className="text-primary"/> :
                                                                <ChevronDown size={14} className="text-primary"/>
                                                            }
                                                        </TouchableOpacity>
                                                    )}
                                                </View>

                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>

            {/* 全螢幕預覽 Modal */}
            <Modal visible={!!previewImage} transparent={true} animationType="fade">
                <View className="flex-1 bg-black/95 justify-center items-center">
                    <TouchableOpacity
                        onPress={() => setPreviewImage(null)}
                        className="absolute top-12 right-6 z-50 p-2 bg-white/10 rounded-full"
                    >
                        <X size={24} color="white"/>
                    </TouchableOpacity>

                    {previewImage && (
                        <Image
                            source={{uri: previewImage}}
                            style={{width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.5}}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
}