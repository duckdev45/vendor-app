import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import {useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {Lock, Pyramid, User} from 'lucide-react-native';
import {useAuth} from '@/context/auth-context';


export default function LoginScreen() {
    const {signIn} = useAuth();
    const [loading, setLoading] = useState(false);

    // 表單狀態
    const [taxId, setTaxId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // if (!taxId || !password) return;
        setLoading(true);
        try {
            // Mock login
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            const mockUser = {id: 'mock-user-id', role: 'admin' as const, name: '測試管理員'};
            const mockToken = 'mock-auth-token-string';
            signIn(mockUser, mockToken);
        } catch (error) {
            console.error(error);
            alert('登入失敗，請檢查統編與密碼');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-zinc-800">
            <StatusBar style="light"/>

            {/* === Background Atmosphere === */}
            {/* 頂部琥珀光暈 */}
            <View
                className="absolute top-[-150] left-[-100] w-[500] h-[500] bg-amber-600/20 rounded-full blur-[120px]"/>
            {/* 底部冷光 */}
            <View
                className="absolute bottom-[-100] right-[-100] w-[400] h-[400] bg-blue-900/10 rounded-full blur-[100px]"/>

            {/* 裝飾線條：模擬建築結構圖 */}
            <View className="absolute inset-0 opacity-10 pointer-events-none">
                <View className="absolute top-[20%] left-0 right-0 h-[1px] bg-white"/>
                <View className="absolute top-[20%] right-[20%] w-[1px] h-[220] bg-white"/>
                <View className="absolute top-[20%] left-[20%] w-[1px] h-[100] bg-white"/>
                {/* 裝飾性的小標示 */}
                <View className="absolute top-[18%] right-[21%]">
                    <Text className="text-white text-[12px] tracking-widest uppercase">quality</Text>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <View className="flex-1 px-8 justify-center">

                    {/* === Header: Brand === */}
                    <View className="mb-16">
                        {/* Icon Container */}
                        <View
                            className="w-16 h-16 opacity-20">
                            <Pyramid size={40} color="#ffffff" strokeWidth={1.5}/>
                        </View>

                        <View>
                            <Text className="text-white text-5xl font-thin tracking-wider uppercase leading-none">
                                {/*EAGLE AI*/}
                                廠商上傳系統
                            </Text>
                            {/*<Text className="text-white text-lg font-bold tracking-[0.38em] uppercase text-justify">*/}
                            {/*    AI*/}
                            {/*</Text>*/}
                        </View>
                    </View>

                    {/* === Form Section (Glassmorphism) === */}
                    <View className="space-y-6">

                        {/* Input: Tax ID */}
                        <View>
                            <Text className="text-zinc-300 text-base font-bold uppercase tracking-wider mb-2 ml-1">
                                帳號
                            </Text>
                            <View
                                className="flex-row items-center h-16 px-4 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50 transition-colors">
                                <User size={20} color="#71717a" style={{marginRight: 12}}/>
                                <TextInput
                                    className="flex-1 text-white text-lg font-medium tracking-widest"
                                    placeholder="請輸入統編"
                                    placeholderTextColor="#52525b"
                                    value={taxId}
                                    onChangeText={setTaxId}
                                    keyboardType="numeric"
                                    maxLength={8}
                                    selectionColor="#F59E0B"
                                />
                            </View>
                        </View>

                        {/* Input: Password */}
                        <View className="mt-4">
                            <Text className="text-zinc-300 text-base font-bold uppercase tracking-wider mb-2 ml-1">
                                密碼
                            </Text>
                            <View
                                className="flex-row items-center h-16 px-4 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50 transition-colors">
                                <Lock size={20} color="#71717a" style={{marginRight: 12}}/>
                                <TextInput
                                    className="flex-1 text-white text-lg font-medium tracking-widest"
                                    placeholder="••••••••"
                                    placeholderTextColor="#52525b"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    selectionColor="#F59E0B"
                                />
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="mt-4">
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.8}
                                className="h-16 bg-amber-600/40 rounded-xl flex-row items-center justify-center shadow-lg shadow-amber-500/20"
                            >
                                {loading ? (
                                    <ActivityIndicator color="#000"/>
                                ) : (
                                    <>
                                        <Text className="text-white font-bold text-xl uppercase tracking-wide">
                                            登入 </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

                {/* Bottom Watermark */}
                <View className="absolute bottom-10 left-0 right-0 items-center">
                    <Text className="text-white/30 text-[10px] tracking-[0.2em]">
                        {/*FU-MAO CONSTRUCTION © 2025*/}
                        EAGLE AI © 2025
                    </Text>
                </View>

            </KeyboardAvoidingView>
        </View>
    );
}