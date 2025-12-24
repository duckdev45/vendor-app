import '@/global.css';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {ThemeProvider, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {useColorScheme} from 'nativewind';
import {PreferencesProvider} from '@/context/preferences-context';

export default function RootLayout() {
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <PreferencesProvider>
            <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                <StatusBar style={isDark ? 'light' : 'dark'}/>

                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found" options={{title: 'Oops!'}}/>
                </Stack>
            </ThemeProvider>
        </PreferencesProvider>
    );
}