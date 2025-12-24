import '@/global.css';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {ThemeProvider, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {useColorScheme} from 'nativewind';
import {PreferencesProvider} from '@/context/preferences-context';
import {AuthProvider} from '@/context/auth-context';

function AppContent() {
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <PreferencesProvider>
            <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                <StatusBar style={isDark ? 'light' : 'dark'}/>

                <Stack screenOptions={{headerShown: false}}>
                    {/*
                        login: 登入頁 (不在 tabs 內)
                        (tabs): 主程式 (受保護)
                    */}
                    <Stack.Screen name="login" options={{headerShown: false, animation: 'fade'}}/>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found" options={{title: 'Oops!'}}/>
                </Stack>
            </ThemeProvider>
        </PreferencesProvider>
    );
}

export default function RootLayout() {
    return (
        // 雙重 Provider：最外層是 Auth，再來是 Preferences
        <AuthProvider>
            <PreferencesProvider>
                <AppContent/>
            </PreferencesProvider>
        </AuthProvider>
    );
}