import {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Linking} from 'react-native';
import {CameraView, useCameraPermissions, BarcodeScanningResult} from 'expo-camera';
import {Flashlight, FlashlightOff, Scan} from 'lucide-react-native';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [torch, setTorch] = useState(false);

    // 1. 處理權限還沒載入
    if (!permission) {
        return <View style={styles.container}/>;
    }

    // 2. 處理權限被拒絕 (雖然你現在已經有了，但為了以後的使用者還是要留著)
    if (!permission.granted) {
        return (
            <View style={[styles.container, styles.permissionContainer]}>
                <Text style={styles.permissionText}>需要相機權限才能進行掃描</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>授權相機</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {marginTop: 10, backgroundColor: '#666'}]}
                                  onPress={() => Linking.openSettings()}>
                    <Text style={styles.buttonText}>打開系統設定</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // 3. 掃描邏輯
    const handleBarCodeScanned = ({type, data}: BarcodeScanningResult) => {
        if (scanned) return;
        setScanned(true);

        // 震動回饋 (可選，需安裝 expo-haptics)
        // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        Alert.alert(
            "掃描成功！",
            `內容: ${data}`,
            [{text: "OK", onPress: () => setTimeout(() => setScanned(false), 1000)}] // 1秒後才能再掃
        );
    };

    return (
        <View style={styles.container}>
            {/* 相機本體 */}
            <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                enableTorch={torch}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            />

            {/* 覆蓋層 (Overlay) - 畫框框和按鈕的地方 */}
            <View style={styles.overlay}>
                {/* 上方提示文字 */}
                <View style={styles.topOverlay}>
                    <Text style={styles.scanText}>對準 QR Code 進行掃描</Text>
                </View>

                {/* 中間掃描框 */}
                <View style={styles.scanFrame}>
                    <View style={[styles.corner, styles.topLeft]}/>
                    <View style={[styles.corner, styles.topRight]}/>
                    <View style={[styles.corner, styles.bottomLeft]}/>
                    <View style={[styles.corner, styles.bottomRight]}/>
                </View>

                {/* 下方控制區 */}
                <View>
                    {/* 手電筒開關 */}
                    <TouchableOpacity
                        onPress={() => setTorch(!torch)}
                    >
                        {torch ? <Flashlight color="#FBBF24" size={24}/> : <FlashlightOff color="white" size={24}/>}
                    </TouchableOpacity>

                    {/* 如果卡住了，手動重置按鈕 */}
                    {scanned && (
                        <TouchableOpacity
                            onPress={() => setScanned(false)}
                        >
                            <Scan color="white" size={20} style={{marginRight: 8}}/>
                            <Text style={styles.buttonText}>再次掃描</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

// 🔥 使用 StyleSheet 保證排版絕對不會壞掉
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    permissionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    permissionText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333',
    },
    button: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Overlay 佈局
    overlay: {
        ...StyleSheet.absoluteFillObject, // 填滿全螢幕
        justifyContent: 'center',
        alignItems: 'center',
    },
    topOverlay: {
        position: 'absolute',
        top: 100,
    },
    scanText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3,
    },
    // 掃描框
    scanFrame: {
        width: 260,
        height: 260,
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
        borderRadius: 16,
        position: 'relative',
    },
    // 框框四個角 (裝飾用)
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#23be3e',
        borderWidth: 4,
    },
    topLeft: {top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0},
    topRight: {top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0},
    bottomLeft: {bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0},
    bottomRight: {bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0},
});