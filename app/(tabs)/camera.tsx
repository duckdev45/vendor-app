import {useState, useRef, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    Image,
    Modal,
    Dimensions,
    ActivityIndicator,
    Pressable,
    Vibration
} from 'react-native';
import {CameraView, useCameraPermissions, BarcodeScanningResult} from 'expo-camera';
import {
    Flashlight, FlashlightOff, Image as ImageIcon, X, MapPin,
    Camera as CameraIcon, Check, ChevronDown, ChevronRight
} from 'lucide-react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import ViewShot, {captureRef} from "react-native-view-shot";
import dayjs from 'dayjs';
import {Accelerometer} from 'expo-sensors';
import {useColorScheme} from "nativewind";

type Mode = 'scan' | 'form' | 'capture';

type QRCodeData = {
    constructionName?: string;
    floor?: string;
    room?: string;
    item?: string;
};

export const spaceOptions = [
    {value: 'LIVING_ROOM', label: '客廳'},
    {value: 'KITCHEN', label: '廚房'},
    {value: 'ENTRANCE', label: '玄關'},
    {value: 'MASTER_BEDROOM', label: '主臥'},
    {value: 'BEDROOM_1', label: '臥室1'},
    {value: 'BEDROOM_2', label: '臥室2'},
    {value: 'BEDROOM_3', label: '臥室3'},
    {value: 'BEDROOM_4', label: '臥室4'},
    {value: 'BEDROOM_5', label: '臥室5'},
    {value: 'MASTER_BATH', label: '主浴'},
    {value: 'COMMON_BATH_1', label: '普浴1'},
    {value: 'COMMON_BATH_2', label: '普浴2'},
    {value: 'WORK_BALCONY', label: '工作陽台'},
    {value: 'MASTER_BALCONY', label: '主臥陽台'},
    {value: 'BEDROOM_BALCONY', label: '臥室陽台'},
    {value: 'VIEW_BALCONY', label: '景觀陽台'},
    {value: 'OTHER', label: '其他'},
];

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const CAM_HEIGHT = SCREEN_WIDTH * (4 / 3);
const SCAN_SIZE = 280;

const INSPECTION_ITEMS = [
    {id: '1', name: '各層器具安裝'},
    {id: '2', name: '模板組立查驗'},
    {id: '3', name: '防水工程查驗'},
    {id: '4', name: '連續壁鋼筋查驗'},
];

// WatermarkInfo 元件：字體大小防呆機制
const WatermarkInfo = ({formData, photoWidth, photoHeight}: {
    formData: any,
    photoWidth: number,
    photoHeight: number
}) => {
    const nowStr = dayjs().format('YYYY-MM-DD HH:mm');

    // 防呆：如果寬高讀取失敗，給予預設值 (避免 Math.min 算出 0)
    const safeW = photoWidth || 1024;
    const safeH = photoHeight || 768;

    // 使用照片的「短邊」作為計算基準
    const baseDimension = Math.min(safeW, safeH);

    // 基準倍率 0.9% (加上 Math.max 確保不為 0)
    const unit = Math.max(0.1, baseDimension * 0.009);

    // 防呆：強制設定最小值 (Math.max)，避免 Android error
    const styles = {
        padding: unit * 3.5,
        borderRadius: unit * 2,
        gap: unit * 1.2,
        titleSize: Math.max(14, unit * 5.0), // 最小 14px
        textSize: Math.max(12, unit * 3.2),  // 最小 12px
        smallTextSize: Math.max(10, unit * 2.8), // 最小 10px
        iconSize: unit * 3.0,
        lineWidth: Math.max(1, unit * 0.2), // 線條至少 1px
        barWidth: Math.max(2, unit),
        barHeight: Math.max(10, unit * 4.5),
    };

    const locationText = `${formData.floor || ''} ${formData.room || ''} ${formData.areaLabel || ''}`.trim();
    const isLandscape = safeW > safeH;
    const actualCanvasWidth = isLandscape ? safeH : safeW;

    return (
        <View
            style={{
                padding: styles.padding,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: styles.borderRadius,
                alignSelf: 'flex-start',
                maxWidth: actualCanvasWidth * 0.9,
            }}
        >
            {/* 建案名稱 */}
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: styles.gap * 2}}>
                <View style={{
                    width: styles.barWidth,
                    height: styles.barHeight,
                    backgroundColor: '#FBBF24',
                    marginRight: styles.gap,
                    borderRadius: unit
                }}/>
                <Text style={{
                    color: '#FBBF24',
                    fontSize: styles.titleSize,
                    fontWeight: 'bold',
                    textShadowColor: 'black',
                    textShadowRadius: 1
                }}>
                    {formData.constructionName || '未指定建案'}
                </Text>
            </View>

            {/* 查驗位置 */}
            <Text style={{color: 'white', fontSize: styles.textSize, fontWeight: '600', marginBottom: styles.gap}}
                  numberOfLines={2}>
                查驗位置：{locationText || '尚未選擇'}
            </Text>

            {/* 項目 */}
            <Text style={{color: 'white', fontSize: styles.textSize, marginBottom: styles.gap * 1.5}} numberOfLines={2}>
                項目：{formData.item || '未指定項目'}
            </Text>

            {/* 分隔線 */}
            <View style={{
                height: styles.lineWidth,
                backgroundColor: 'rgba(255,255,255,0.3)',
                marginBottom: styles.gap * 1.5
            }}/>

            {/* 時間與備註 */}
            <View>
                <Text style={{color: '#E4E4E7', fontSize: styles.smallTextSize, marginBottom: styles.gap}}>
                    時間：{nowStr}
                </Text>

                {formData.note ? (
                    <Text style={{color: '#D4D4D8', fontSize: styles.smallTextSize, marginBottom: styles.gap}}
                          numberOfLines={2}>
                        備註: {formData.note}
                    </Text>
                ) : null}
            </View>
        </View>
    );
};

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const processingRef = useRef<ViewShot>(null);
    const insets = useSafeAreaInsets();
    const {colorScheme} = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [mode, setMode] = useState<Mode>('scan');
    const [scanned, setScanned] = useState(false);

    const [torch, setTorch] = useState(false);
    const [deviceOrientation, setDeviceOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [selectedItem, setSelectedItem] = useState(INSPECTION_ITEMS[0]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isAreaSelectorOpen, setIsAreaSelectorOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        constructionName: '',
        floor: '',
        room: '',
        item: '',
        area: '',
        areaLabel: '',
        note: '',
        photos: [] as string[]
    });
    const [showToast, setShowToast] = useState(false);
    const [processingQueue, setProcessingQueue] = useState<any[]>([]);
    const [currentProcessing, setCurrentProcessing] = useState<any>(null);

    useEffect(() => {
        if (mode === 'scan') {
            const timer = setTimeout(() => setScanned(false), 500);
            return () => clearTimeout(timer);
        }
    }, [mode]);

    useEffect(() => {
        Accelerometer.setUpdateInterval(500);
        const subscription = Accelerometer.addListener(data => {
            if (Math.abs(data.x) > Math.abs(data.y)) {
                setDeviceOrientation('landscape');
            } else {
                setDeviceOrientation('portrait');
            }
        });
        return () => subscription && subscription.remove();
    }, []);

    useEffect(() => {
        if (!currentProcessing && processingQueue.length > 0) {
            const nextPhoto = processingQueue[0];
            setProcessingQueue(prev => prev.slice(1));
            setCurrentProcessing(nextPhoto);
        }
    }, [processingQueue, currentProcessing]);

    useEffect(() => {
        if (currentProcessing && processingRef.current) {
            const timer = setTimeout(async () => {
                try {
                    const uri = await captureRef(processingRef, {
                        format: "jpg",
                        quality: 0.9,
                        result: "tmpfile"
                    });
                    setFormData(prev => ({...prev, photos: [...prev.photos, uri]}));
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 1000);
                } catch (error) {
                    console.error("處理浮水印發生錯誤", error);
                } finally {
                    setCurrentProcessing(null);
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [currentProcessing]);

    const handleBarCodeScanned = ({type, data}: BarcodeScanningResult) => {
        if (mode !== 'scan' || scanned) return;
        setScanned(true);
        Vibration.vibrate();

        try {
            const parsedData: QRCodeData = JSON.parse(data);
            if (parsedData.floor || parsedData.room) {
                setFormData(prev => ({
                    ...prev,
                    constructionName: parsedData.constructionName || '未命名建案',
                    floor: parsedData.floor || '',
                    room: parsedData.room || '',
                    item: parsedData.item || selectedItem.name,
                }));
                setMode('form');
            } else {
                Alert.alert("格式不符", "QR Code 內容缺少必要資訊", [{text: "確定", onPress: () => setScanned(false)}]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("掃描失敗", "這不是本系統支援的 QR Code 格式", [{
                text: "確定",
                onPress: () => setScanned(false)
            }]);
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                // skipProcessing: true 會加速拍照，但有時會導致寬高資訊不準確，我們在 WatermarkInfo 做了防呆
                const photo = await cameraRef.current.takePictureAsync({quality: 0.8, skipProcessing: true});
                if (photo) {
                    setProcessingQueue(prev => [...prev, {
                        uri: photo.uri,
                        width: photo.width || 1080, // 防呆：如果寬度是 0，預設 1080
                        height: photo.height || 1920, // 防呆：預設 1920
                        isLandscape: deviceOrientation === 'landscape'
                    }]);
                }
            } catch (e) {
                console.error(e);
                Alert.alert("錯誤", "拍照失敗");
            }
        }
    };

    const handleTakePhoto = () => {
        if (!formData.area) {
            Alert.alert("請先選擇區域", "必須先選擇一個區域才能新增照片");
            return;
        }
        setMode('capture');
    };

    const handlePickImage = () => {
        if (!formData.area) {
            Alert.alert("請先選擇區域", "必須先選擇一個區域才能新增照片");
            return;
        }
        pickImage();
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.8,
                allowsMultipleSelection: true,
            });
            if (!result.canceled) {
                const newItems = result.assets.map((asset) => ({
                    uri: asset.uri,
                    width: asset.width || 1080,
                    height: asset.height || 1920,
                    isLandscape: asset.width > asset.height
                }));
                setProcessingQueue((prev) => [...prev, ...newItems]);
            }
        } catch (e) {
            console.error("ImagePicker Error:", e);
            Alert.alert("提示", "開啟相簿失敗，請確認權限或裝置狀態");
        }
    };

    const removePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handleUpload = () => {
        if (!formData.area) {
            Alert.alert("請選擇區域");
            return;
        }
        if (processingQueue.length > 0 || currentProcessing) {
            Alert.alert("請稍候", "照片處理中...");
            return;
        }
        Alert.alert("上傳成功", `已上傳 ${formData.photos.length} 張照片`);
        setFormData(prev => ({...prev, photos: [], note: ''}));
        setMode('scan');
    };

    if (!permission) return <View className="flex-1 bg-background"/>;
    if (!permission.granted) {
        return (
            <View className="flex-1 bg-background justify-center items-center p-6">
                <TouchableOpacity className="bg-primary px-8 py-3 rounded-full" onPress={requestPermission}>
                    <Text className="text-primary-foreground font-bold">授權相機</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const MASK_COLOR = isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)';

    return (
        <View className="flex-1 bg-black">
            {mode === 'scan' && (
                <View style={StyleSheet.absoluteFill}>
                    <CameraView
                        style={StyleSheet.absoluteFill}
                        facing="back"
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{barcodeTypes: ["qr"]}}
                    />
                    <View style={StyleSheet.absoluteFill}>
                        <View style={{
                            flex: 1,
                            backgroundColor: MASK_COLOR,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingBottom: 40
                        }}>
                            <TouchableOpacity
                                onPress={() => setIsSelectorOpen(true)}
                                className="w-4/5 bg-card/90 p-4 rounded-xl border border-border flex-row justify-between items-center"
                            >
                                <View style={{flex: 1}}>
                                    <Text className="text-muted-foreground text-xs mb-1">目前項目</Text>
                                    <Text className="text-foreground font-bold text-lg" numberOfLines={1}>
                                        {selectedItem.name}
                                    </Text>
                                </View>
                                <ChevronDown size={20} color={isDarkMode ? '#FBBF24' : '#F59E0B'}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection: 'row', height: SCAN_SIZE}}>
                            <View style={{flex: 1, backgroundColor: MASK_COLOR}}/>
                            <View style={{
                                width: SCAN_SIZE,
                                height: SCAN_SIZE,
                                backgroundColor: 'transparent',
                                borderColor: isDarkMode ? '#FBBF24' : '#F59E0B',
                                borderWidth: 5,
                                borderRadius: 1
                            }}/>
                            <View style={{flex: 1, backgroundColor: MASK_COLOR}}/>
                        </View>
                        <View style={{flex: 1, backgroundColor: MASK_COLOR, alignItems: 'center', paddingTop: 20}}>
                            <TouchableOpacity onPress={() => setMode('form')}
                                              className="bg-muted px-6 py-3 rounded-full">
                                <Text className="text-foreground font-bold">手動輸入</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <Modal visible={isSelectorOpen} transparent animationType="fade"
                   onRequestClose={() => setIsSelectorOpen(false)}>
                <View className="flex-1 bg-black/80 justify-center items-center px-6">
                    <View className="bg-card w-full rounded-3xl border border-border p-5 max-h-[60%]">
                        <View className="flex-row justify-between items-center mb-6 border-b border-border pb-4">
                            <Text className="text-foreground font-bold text-xl">選擇查驗工項</Text>
                            <TouchableOpacity onPress={() => setIsSelectorOpen(false)}
                                              className="bg-muted p-2 rounded-full">
                                <X color={isDarkMode ? '#F4F4F5' : '#71717A'} size={26}/>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {INSPECTION_ITEMS.map(item => (
                                <TouchableOpacity key={item.id} onPress={() => {
                                    setSelectedItem(item);
                                    setIsSelectorOpen(false);
                                }}
                                                  className={`p-4 rounded-xl mb-3 border ${item.id === selectedItem.id ? 'border-primary bg-primary/10' : 'border-border bg-muted'}`}>
                                    <Text
                                        className={`font-bold text-base ${item.id === selectedItem.id ? 'text-primary' : 'text-foreground'}`}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={mode !== 'scan'}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={() => setMode('scan')}
            >
                {mode === 'capture' && (
                    <View className="flex-1 bg-black">
                        <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'black'}}>
                            <View style={{width: SCREEN_WIDTH, height: CAM_HEIGHT, overflow: 'hidden'}}>
                                <CameraView ref={cameraRef} style={{flex: 1}} facing="back" enableTorch={torch}>
                                </CameraView>
                            </View>
                        </View>
                        <View style={[StyleSheet.absoluteFill, {zIndex: 10}]} pointerEvents="box-none">
                            <SafeAreaView className="flex-1 justify-between mx-4">
                                <View style={{paddingTop: insets.top + 10}}
                                      className="flex-row justify-between items-center">
                                    <TouchableOpacity onPress={() => setMode('form')}
                                                      className="bg-black/40 p-3 rounded-full">
                                        <X color="white" size={24}/>
                                    </TouchableOpacity>
                                    <View className="flex-row gap-3 bg-black/40 p-2 rounded-full items-center">
                                        <View className="w-[1px] h-4 bg-white/20"/>
                                        <TouchableOpacity onPress={() => setTorch(!torch)} className="p-2">
                                            {torch ? <Flashlight color="#FBBF24" size={20}/> :
                                                <FlashlightOff color="white" size={20}/>}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View className="flex-row justify-around items-center mb-8">
                                    <View className="w-12"/>
                                    <TouchableOpacity
                                        onPress={takePicture}
                                        className="w-24 h-24 rounded-full border-4 border-white/30 items-center justify-center bg-black/10 active:scale-90"
                                    >
                                        <View className="w-20 h-20 bg-white rounded-full border-4 border-black/10"/>
                                    </TouchableOpacity>
                                    <View className="w-12"/>
                                </View>
                            </SafeAreaView>
                        </View>
                        {(processingQueue.length > 0 || currentProcessing) && (
                            <View pointerEvents="none" style={{
                                position: 'absolute', top: insets.top + 60, alignSelf: 'center',
                                backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 8,
                                borderRadius: 20, flexDirection: 'row', alignItems: 'center'
                            }}>
                                <ActivityIndicator color="#FBBF24" size="small" style={{marginRight: 8}}/>
                                <Text className="text-white text-xs font-bold">
                                    正在處理 {processingQueue.length + (currentProcessing ? 1 : 0)} 張...
                                </Text>
                            </View>
                        )}
                        {showToast && (
                            <View pointerEvents="none" style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: [{translateX: -75}, {translateY: -50}],
                                width: 150,
                                height: 100,
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                borderRadius: 16,
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 9999
                            }}>
                                <Check size={40} color="#FBBF24" style={{marginBottom: 8}}/>
                                <Text className="text-white font-bold text-lg">已加入</Text>
                            </View>
                        )}
                        {currentProcessing && (
                            <View
                                collapsable={false}
                                style={{
                                    position: 'absolute', top: 0, left: 0, zIndex: -999,
                                    width: currentProcessing.isLandscape ? currentProcessing.height : currentProcessing.width,
                                    height: currentProcessing.isLandscape ? currentProcessing.width : currentProcessing.height,
                                }}
                            >
                                <ViewShot ref={processingRef} options={{format: "jpg", quality: 0.9}}
                                          style={{width: '100%', height: '100%'}}>
                                    <View style={{flex: 1, backgroundColor: 'black', overflow: 'hidden'}}>
                                        <Image
                                            source={{uri: currentProcessing.uri}}
                                            style={{
                                                width: currentProcessing.width, height: currentProcessing.height,
                                                position: 'absolute',
                                                top: currentProcessing.isLandscape ? (currentProcessing.width - currentProcessing.height) / 2 : 0,
                                                left: currentProcessing.isLandscape ? (currentProcessing.height - currentProcessing.width) / 2 : 0,
                                                transform: currentProcessing.isLandscape ? [{rotate: '-90deg'}] : []
                                            }}
                                        />
                                        <View style={{
                                            position: 'absolute',
                                            bottom: Math.min(currentProcessing.width, currentProcessing.height) * 0.04,
                                            left: Math.min(currentProcessing.width, currentProcessing.height) * 0.04,
                                        }}>
                                            <WatermarkInfo
                                                formData={formData}
                                                photoWidth={currentProcessing.width}
                                                photoHeight={currentProcessing.height}
                                            />
                                        </View>
                                    </View>
                                </ViewShot>
                            </View>
                        )}
                    </View>
                )}
                {mode === 'form' && (
                    <View className="flex-1 bg-background">
                        {/* 這裡保持原樣 ... */}
                        <View style={{paddingTop: insets.top + 10}}
                              className="bg-background z-10 border-b border-border">
                            <View className="flex-row justify-between items-center px-4 py-4">
                                <TouchableOpacity onPress={() => setMode('scan')} className="p-2 -ml-2">
                                    <X color={isDarkMode ? '#F4F4F5' : '#71717A'} size={26}/>
                                </TouchableOpacity>
                                <Text className="text-foreground text-lg font-bold">新增品管照片</Text>
                                <TouchableOpacity className="p-2 -mr-2"><Text
                                    className="text-primary font-bold text-base">儲存草稿</Text></TouchableOpacity>
                            </View>
                            <View className="bg-primary/10 px-4 py-2 flex-row items-center mb-2 mx-4 rounded-lg">
                                <Check size={14} color={isDarkMode ? '#F4F4F5' : '#71717A'}/>
                                <Text
                                    className="text-primary text-xs ml-2">已自動帶入 {formData.constructionName || '建案'} 資訊</Text>
                            </View>
                        </View>
                        <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{paddingBottom: 180}}>
                            <View className="mb-6">
                                <Text className="text-muted-foreground text-xs mb-2 pl-1">檢查項目</Text>
                                <View
                                    className="bg-muted p-4 rounded-xl border border-primary/50 flex-row items-center">
                                    <Text className="text-primary font-bold flex-1 text-base">{formData.item}</Text>
                                </View>
                            </View>
                            <View className="flex-row gap-4 mb-6">
                                <View className="flex-1">
                                    <Text className="text-muted-foreground text-xs mb-2 pl-1">樓層</Text>
                                    <View className="bg-muted p-4 rounded-xl border border-border"><Text
                                        className="text-foreground font-bold text-base">{formData.floor || '尚未掃描'}</Text></View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-muted-foreground text-xs mb-2 pl-1">戶別</Text>
                                    <View className="bg-muted p-4 rounded-xl border border-border"><Text
                                        className="text-foreground font-bold text-base">{formData.room || '尚未掃描'}</Text></View>
                                </View>
                            </View>
                            <View className="mb-6">
                                <Text className="text-muted-foreground text-xs mb-2 pl-1">區域 *</Text>
                                <TouchableOpacity onPress={() => setIsAreaSelectorOpen(true)}
                                                  className={`p-4 rounded-xl border flex-row justify-between items-center ${formData.areaLabel ? 'bg-muted border-primary/50' : 'bg-muted border-border'}`}>
                                    <Text
                                        className={`${formData.areaLabel ? 'text-foreground' : 'text-muted-foreground'} text-base font-bold`}>{formData.areaLabel || '請選擇區域...'}</Text>
                                    <MapPin size={18}
                                            color={isDarkMode ? '#F4F4F5' : '#71717A'}/>
                                </TouchableOpacity>
                            </View>
                            <View className="mb-8">
                                <Text className="text-muted-foreground text-xs mb-2 pl-1">備註</Text>
                                <TextInput
                                    className="bg-muted p-4 rounded-xl border border-border h-28 text-foreground text-base"
                                    placeholder="輸入備註事項..."
                                    placeholderTextColor="#71717A"
                                    value={formData.note}
                                    onChangeText={(text) => setFormData(prev => ({...prev, note: text}))}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                            <Text className="text-muted-foreground text-xs mb-2 pl-1">新增照片</Text>
                            <View className=" gap-3 mb-8">
                                <TouchableOpacity onPress={handleTakePhoto}
                                                  className="flex-1 bg-muted p-4 rounded-2xl items-center justify-center border border-border active:bg-border h-24">
                                    <CameraIcon size={28} color={isDarkMode ? '#F4F4F5' : '#71717A'}/><Text
                                    className="text-muted-foreground font-bold mt-2">拍攝照片</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handlePickImage}
                                                  className="flex-1 bg-muted p-4 rounded-2xl items-center justify-center border border-border active:bg-border h-24">
                                    <ImageIcon size={28} color={isDarkMode ? '#F4F4F5' : '#71717A'}/><Text
                                    className="text-muted-foreground font-bold mt-2">從相簿選取</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row justify-between items-center mb-4 px-1">
                                <Text className="text-muted-foreground text-sm font-medium">待上傳照片
                                    ({formData.photos.length})</Text>
                            </View>
                            {formData.photos.length === 0 ? (
                                <View
                                    className="items-center justify-center py-8 border-2 border-dashed border-border rounded-xl">
                                    <Text className="text-muted-foreground/50 text-sm">尚未加入任何照片</Text>
                                </View>
                            ) : (
                                <View className="flex-row flex-wrap gap-2">
                                    {formData.photos.map((uri, index) => (
                                        <View key={index}
                                              className="w-[31%] aspect-square rounded-xl bg-muted relative overflow-hidden mb-2">
                                            <Pressable onPress={() => setPreviewImage(uri)} style={{flex: 1}}>
                                                <Image source={{uri}} className="w-full h-full" resizeMode="cover"/>
                                            </Pressable>
                                            <TouchableOpacity onPress={() => removePhoto(index)}
                                                              className="absolute top-1 right-1 bg-black/60 p-1.5 rounded-full z-10">
                                                <X size={10} color="white"/>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </ScrollView>
                        <View className="bg-background px-6 pt-4 border-t border-border/50"
                              style={{paddingBottom: insets.bottom + 20}}>
                            <TouchableOpacity onPress={handleUpload}
                                              className="w-full bg-primary h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-primary/20 active:opacity-90">
                                <Text className="text-primary-foreground font-bold text-lg mr-2">確認上傳</Text>
                                <ChevronRight size={20} className="text-primary-foreground"/>
                            </TouchableOpacity>
                        </View>
                        {isAreaSelectorOpen && (
                            <View style={StyleSheet.absoluteFill} className="z-50">
                                <TouchableOpacity style={StyleSheet.absoluteFill} className="bg-black/80"
                                                  activeOpacity={1} onPress={() => setIsAreaSelectorOpen(false)}/>
                                <View
                                    className="absolute bottom-0 w-full bg-card rounded-t-3xl border-t border-border p-5 max-h-[70%] shadow-2xl">
                                    <View
                                        className="flex-row justify-between items-center mb-4 border-b border-border pb-4">
                                        <Text className="text-foreground font-bold text-xl">選擇區域</Text>
                                        <TouchableOpacity onPress={() => setIsAreaSelectorOpen(false)}
                                                          className="bg-muted p-2 rounded-full"><X size={20}
                                                                                                   className="text-muted-foreground"/></TouchableOpacity>
                                    </View>
                                    <ScrollView>
                                        {spaceOptions.map(option => (
                                            <TouchableOpacity key={option.value} onPress={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    area: option.value,
                                                    areaLabel: option.label
                                                }));
                                                setIsAreaSelectorOpen(false);
                                            }}
                                                              className={`p-4 rounded-xl mb-3 border flex-row items-center justify-between ${formData.area === option.value ? 'border-primary bg-primary/10' : 'border-border bg-muted'}`}>
                                                <Text
                                                    className={`font-bold text-base ${formData.area === option.value ? 'text-primary' : 'text-foreground'}`}>{option.label}</Text>
                                                {formData.area === option.value &&
                                                    <Check size={18} className="text-primary"/>}
                                            </TouchableOpacity>
                                        ))}
                                        <View className="h-10"/>
                                    </ScrollView>
                                </View>
                            </View>
                        )}
                        {previewImage && (
                            <View style={[StyleSheet.absoluteFill, {zIndex: 9999, backgroundColor: 'black'}]}>
                                <TouchableOpacity
                                    style={{position: 'absolute', top: 50, right: 20, zIndex: 10000, padding: 10}}
                                    onPress={() => setPreviewImage(null)}
                                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                                >
                                    <X size={30} color="white"/>
                                </TouchableOpacity>
                                <ScrollView
                                    maximumZoomScale={3.0}
                                    minimumZoomScale={1.0}
                                    centerContent={true}
                                    contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                                >
                                    <Image source={{uri: previewImage}}
                                           style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}} resizeMode="contain"/>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}
            </Modal>
        </View>
    );
}

