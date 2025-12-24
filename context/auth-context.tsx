import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter, useSegments} from 'expo-router';
import {DeviceEventEmitter} from 'react-native';
import {AUTH_EVENTS} from '@/lib/api-client';

type User = {
    id: string;
    role: 'admin' | 'vendor';
    name: string;
} | null;

type AuthContextType = {
    user: User;
    isLoading: boolean;
    signIn: (user: NonNullable<User>, token: string) => void;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    // 1. 初始化檢查
    useEffect(() => {
        const loadAuth = async () => {
            const storedUser = await AsyncStorage.getItem('user_data');
            const storedToken = await AsyncStorage.getItem('auth_token');
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
        };
        loadAuth();
    }, []);

    // 2. 路由保護機制
    useEffect(() => {
        if (isLoading) return;
        const inAuthGroup = segments[0] === '(tabs)';

        if (!user && inAuthGroup) {
            router.replace('/login');
        } else if (user && !inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [user, segments, isLoading]);

    //  監聽 API 的 401 登出訊號
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener(AUTH_EVENTS.UNAUTHORIZED, () => {
            signOut(); // 呼叫下方的登出函式
        });
        return () => subscription.remove();
    }, []);

    const signIn = async (userData: NonNullable<User>, token: string) => {
        setUser(userData);
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        await AsyncStorage.setItem('auth_token', token);
    };

    const signOut = async () => {
        setUser(null); // 這會觸發上面的 useEffect 自動跳轉回 login
        await AsyncStorage.removeItem('user_data');
        await AsyncStorage.removeItem('auth_token');
    };

    return (
        <AuthContext.Provider value={{user, isLoading, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};