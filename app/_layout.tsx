import '@/global.css';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {ThemeProvider, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {View} from 'react-native';
import {useColorScheme} from 'nativewind';

export default function RootLayout() {
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>

            <View style={{flex: 1}} className={colorScheme}>

                <StatusBar style={isDark ? 'light' : 'dark'}/>

                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found" options={{title: 'Oops!'}}/>
                </Stack>

            </View>
        </ThemeProvider>
    );
}