import axios, {AxiosError, AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DeviceEventEmitter, Alert} from 'react-native';

// 定義 API 回傳的標準格式
interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
}

// 事件名稱常數
export const AUTH_EVENTS = {
    UNAUTHORIZED: 'auth:unauthorized',
};

/**
 * 建立 HTTP Client 實例的工廠函式
 */
export function createHttpClient(baseURL: string): AxiosInstance {
    const instance = axios.create({
        baseURL,
        timeout: 15000,
        headers: {'Content-Type': 'application/json'},
    });

    // === Request 攔截器 (自動帶 Token) ===
    instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            // 在 RN 裡讀取 Storage 是非同步的，這在 axios 攔截器裡是允許的
            const token = await AsyncStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    // === Response 攔截器 (統一處理錯誤) ===
    instance.interceptors.response.use(
        (response) => {
            // 假設你的後端成功會回傳 200，且 body 包含 code === 0
            const {code, msg, data} = response.data as ApiResponse;

            // 成功 (Happy Path)
            // 這裡可以根據後端習慣，有些是 code === 200 或 success === true
            if (code === 0 || code === 200) {
                return data;
            }

            // 處理權限錯誤 (Token 過期 / 被踢出) -> 觸發登出
            // 假設 10004 是權限不足，401 是標準 HTTP status
            if (code === 10004 || code === 401) {
                // 發送訊號給 AuthContext 執行登出
                DeviceEventEmitter.emit(AUTH_EVENTS.UNAUTHORIZED);
                return Promise.reject(new Error(msg || '權限已過期'));
            }

            // 其他業務錯誤 (例如參數錯誤)
            Alert.alert('提示', msg || '發生未知錯誤');
            return Promise.reject(new Error(msg));
        },
        (error: AxiosError) => {
            // 處理 HTTP Status != 2xx 的情況
            const status = error.response?.status;

            if (status === 401 || status === 403) {
                DeviceEventEmitter.emit(AUTH_EVENTS.UNAUTHORIZED);
            } else {
                Alert.alert('網路錯誤', error.message || '請檢查網路連線');
            }

            return Promise.reject(error);
        }
    );

    return instance;
}

// === export ===

// 從環境變數讀取 API 網址
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://dev.eagleai.tw/api/qms';

// 原始 API
export const api = createHttpClient(API_BASE_URL);

// v1 API
export const v1Api = createHttpClient(`${API_BASE_URL}/v1`);