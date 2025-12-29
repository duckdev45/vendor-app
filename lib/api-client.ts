import axios, {AxiosError, AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DeviceEventEmitter, Alert} from 'react-native';

// defined API response structure
interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
}

// defined auth events
export const AUTH_EVENTS = {
    UNAUTHORIZED: 'auth:unauthorized',
};

/**
 * create Axios HTTP client with interceptors
 * @param baseURL API base URL
 * @returns AxiosInstance
 */
export function createHttpClient(baseURL: string): AxiosInstance {
    const instance = axios.create({
        baseURL,
        timeout: 15000,
        headers: {'Content-Type': 'application/json'},
    });

    // Request interceptor (attach token)
    instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            // read token from AsyncStorage and attach to headers
            const token = await AsyncStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor (handle responses)
    instance.interceptors.response.use(
        (response) => {
            // successful response within 2xx
            const {code, msg, data} = response.data as ApiResponse;

            // successful business logic
            // code 0 or 200 means success
            if (code === 0 || code === 200) {
                return data;
            }

            // process unauthorized errors
            // code 10004 or 401 means unauthorized
            if (code === 10004 || code === 401) {
                // send unauthorized event
                DeviceEventEmitter.emit(AUTH_EVENTS.UNAUTHORIZED);
                return Promise.reject(new Error(msg || '權限已過期'));
            }

            // other business errors (e.g., validation errors)
            Alert.alert('提示', msg || '發生未知錯誤');
            return Promise.reject(new Error(msg));
        },
        (error: AxiosError) => {
            // process network or server errors
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

// read API base URL from environment variable or use default
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://dev.eagleai.tw/api/qms';

// default API client
export const api = createHttpClient(API_BASE_URL);

// versioned API client (v1)
export const v1Api = createHttpClient(`${API_BASE_URL}/v1`);