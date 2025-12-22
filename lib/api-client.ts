import axios from 'axios';

// 建立實例
export const apiClient = axios.create({
    // 把網址放在 .env 檔案，用 process.env.EXPO_PUBLIC_API_URL 讀取
    baseURL: 'https://api.fumao-construction.com/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request 攔截器 (自動帶 Token)
apiClient.interceptors.request.use(async (config) => {
    // 假設你有用 expo-secure-store 存 token
    // const token = await SecureStore.getItemAsync('user_token');
    const token = 'mock-token'; // 暫時寫死
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response 攔截器 (簡化回傳值)
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);