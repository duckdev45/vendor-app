import {View, Text, Image, ActivityIndicator, useColorScheme as useSystemColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState, useEffect} from 'react';
import {vars} from "nativewind";
import * as Location from 'expo-location';
import {LinearGradient} from 'expo-linear-gradient';

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'thunder';
// 定義漸層顏色的 Tuple 型別
type GradientColors = [string, string, ...string[]];

// 鎖定字體變數
const fixedFontStyles = vars({
    '--text-xs': 12,
    '--text-sm': 14,
    '--text-base': 16,
    '--text-lg': 18,
    '--text-xl': 20,
    '--text-2xl': 24,
    '--text-3xl': 30,
    '--text-4xl': 36,
    '--text-5xl': 48,
    '--text-6xl': 60,
    '--text-8xl': 96,
    '--text-9xl': 110,
});

export default function HomeScreen() {
    const systemColorScheme = useSystemColorScheme();
    const isDark = systemColorScheme === 'dark';

    // === 狀態管理 ===
    const [weatherType, setWeatherType] = useState<WeatherType>('sunny');
    const [temperature, setTemperature] = useState('--');
    const [locationName, setLocationName] = useState('Locating...');
    const [weatherStatus, setWeatherStatus] = useState('Loading...');
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // === 時鐘與日期邏輯 ===
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = currentTime.toLocaleTimeString('zh-TW', {
        hour: '2-digit', minute: '2-digit', hour12: false
    });

    const year = currentTime.getFullYear();
    const month = (currentTime.getMonth() + 1);
    const date = currentTime.getDate();
    const dayIndex = currentTime.getDay();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    const dateString = `${year}年${month}月${date}日 | ${weekDays[dayIndex]}`;

    // === API & 定位邏輯 ===
    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setWeatherStatus('No Permission');
                setLocationName('Unknown');
                setLoading(false);
                return;
            }

            try {
                let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
                const {latitude, longitude} = location.coords;

                // 反向地理編碼 (Reverse Geocoding)
                let address = await Location.reverseGeocodeAsync({latitude, longitude});
                if (address && address.length > 0) {
                    // 優先抓取 city (市)，如果沒有則抓 region (縣/區)
                    // 注意：模擬器有時會抓不到，實機比較準
                    const city = address[0].city || address[0].region || "Unknown City";
                    setLocationName(city);
                }

                // 取得天氣
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
                );
                const data = await response.json();
                const current = data.current_weather;

                setTemperature(`${Math.round(current.temperature)}`);

                const code = current.weathercode;
                if (code <= 1) {
                    setWeatherType('sunny');
                    setWeatherStatus('Sunny');
                } else if (code <= 48) {
                    setWeatherType('cloudy');
                    setWeatherStatus('Cloudy');
                } else if (code >= 95) {
                    setWeatherType('thunder');
                    setWeatherStatus('Thunder');
                } else {
                    setWeatherType('rainy');
                    setWeatherStatus('Rainy');
                }
            } catch (error) {
                console.log(error);
                setWeatherStatus('Offline');
                setLocationName('Offline');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // === 視覺設定檔 ===
    // 定義 interface 讓 TS 知道 gradient 必須是 GradientColors
    interface ThemeConfig {
        image: any;
        gradient: GradientColors;
        textColor: string;
        subTextColor: string;
    }

    const weatherConfig: Record<WeatherType, ThemeConfig> = {
        sunny: {
            image: require('@/assets/images/weather-sunny.png'),
            gradient: isDark ? ['#7c2d12', '#431407'] : ['#ffedd5', '#fff7ed'],
            textColor: isDark ? 'text-orange-100' : 'text-orange-950',
            subTextColor: isDark ? 'text-orange-300' : 'text-orange-900/60',
        },
        cloudy: {
            image: require('@/assets/images/weather-cloudy.png'),
            gradient: isDark ? ['#27272a', '#09090b'] : ['#f4f4f5', '#ffffff'],
            textColor: isDark ? 'text-zinc-100' : 'text-zinc-800',
            subTextColor: isDark ? 'text-zinc-400' : 'text-zinc-500',
        },
        rainy: {
            image: require('@/assets/images/weather-rain.png'),
            gradient: isDark ? ['#1e3a8a', '#172554'] : ['#dbeafe', '#eff6ff'],
            textColor: isDark ? 'text-blue-100' : 'text-blue-900',
            subTextColor: isDark ? 'text-blue-300' : 'text-blue-800/60',
        },
        thunder: {
            image: require('@/assets/images/weather-thunder.png'),
            gradient: isDark ? ['#581c87', '#2e1065'] : ['#f3e8ff', '#faf5ff'],
            textColor: isDark ? 'text-purple-100' : 'text-purple-900',
            subTextColor: isDark ? 'text-purple-300' : 'text-purple-800/60',
        }
    };

    const currentTheme = weatherConfig[weatherType];

    return (
        <View className="flex-1" style={fixedFontStyles}>
            {/* 滿版背景漸層 */}
            <LinearGradient
                colors={currentTheme.gradient}
                style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            />

            <SafeAreaView className="flex-1 relative justify-between">

                {/* === Header: Brand Logo === */}
                <View className="px-8 mt-6">
                    <Text
                        className={`text-3xl font-light tracking-[0.2em] uppercase leading-tight ${currentTheme.textColor}`}>
                        FU-MAO
                    </Text>
                    <Text
                        className={`text-3xl font-black tracking-[0.2em] uppercase leading-tight -mt-1 ${currentTheme.textColor}`}>
                        CONSTRUCTION
                    </Text>
                </View>

                {/* === Center: Time & Date & Location === */}
                <View className="items-center -mt-16">
                    {/* 日期 */}
                    <Text className={`text-xl font-medium tracking-[0.15em] mb-5 ${currentTheme.subTextColor}`}>
                        {dateString}
                    </Text>

                    {/* 時間 */}
                    <Text
                        className={`font-light tracking-tighter tabular-nums leading-none ${currentTheme.textColor}`}
                        style={{fontSize: 100, fontFamily: 'System', includeFontPadding: false}}
                    >
                        {timeString}
                    </Text>

                    {/* 地點 */}
                    <View
                        className="mt-2 flex-row items-center border border-black/5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                        <Text className={`text-base font-bold tracking-widest uppercase ${currentTheme.textColor}`}>
                            📍 {locationName}
                        </Text>
                    </View>
                </View>

                {/* === Footer: Weather Info === */}
                <View className="flex-row justify-between items-end px-8 pb-8">

                    {/* 左下：溫度 & 狀態 */}
                    <View className="pb-16">
                        {/* Status Label */}
                        <View
                            className={`self-start px-3 py-1.5 rounded-lg border border-black/5 mb-2 bg-white/30 backdrop-blur-sm`}>
                            <Text className={`text-xs font-bold uppercase tracking-widest ${currentTheme.textColor}`}>
                                {weatherStatus}
                            </Text>
                        </View>

                        <View className="flex-row items-start">
                            <Text
                                className={`font-medium tracking-tighter leading-none ${currentTheme.textColor}`}
                                style={{fontSize: 88, includeFontPadding: false}}
                            >
                                {temperature}
                            </Text>
                            <Text className={`text-3xl font-medium mt-4 ml-1 ${currentTheme.textColor}`}>
                                °C
                            </Text>
                        </View>
                    </View>

                    {/* 右下：3D Icon */}
                    <View className="-mr-10 -mb-5 shadow-2xl shadow-black/20">
                        {loading ? (
                            <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"}/>
                        ) : (
                            <Image
                                source={currentTheme.image}
                                style={{width: 280, height: 280}}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </View>

            </SafeAreaView>
        </View>
    );
}