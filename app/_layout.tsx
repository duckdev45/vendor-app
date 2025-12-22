import '@/global.css';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {ThemeProvider, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {useColorScheme} from 'nativewind';
import {View} from 'react-native';
import {PreferencesProvider, usePreferences} from '@/context/preferences-context';

function AppContent() {
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';
    const {fontScale} = usePreferences();

    const dynamicStyles = {
        '--text-xs': `${12 * fontScale}px`,
        '--text-sm': `${14 * fontScale}px`,
        '--text-base': `${16 * fontScale}px`,
        '--text-lg': `${18 * fontScale}px`,
        '--text-xl': `${20 * fontScale}px`,
        '--text-2xl': `${24 * fontScale}px`,
        '--text-3xl': `${30 * fontScale}px`,
        '--text-4xl': `${36 * fontScale}px`,
    } as any;

    return (
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <StatusBar style={isDark ? 'light' : 'dark'}/>

            <View style={[{flex: 1}, dynamicStyles]}>
                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found" options={{title: 'Oops!'}}/>
                </Stack>
            </View>
        </ThemeProvider>
    );
}

export default function RootLayout() {
    return (
        // 最外層包上 PreferencesProvider
        <PreferencesProvider>
            <AppContent/>
        </PreferencesProvider>
    );
}