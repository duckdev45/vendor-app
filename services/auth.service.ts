// services/auth.service.ts
import { v1Api } from '@/lib/api-client'; // 假設你有這個，沒有的話用 axios 即可

// 定義回傳的 Token 資料結構 (依後端實際狀況調整)
export type AuthResponse = {
    token: string;
    user: {
        id: string;
        name: string;
        role: 'admin' | 'vendor';
    };
};

export const AuthService = {
    // 員工登入
    loginAdmin: async (empId: string, password: string) => {
        // return v1Api.post<AuthResponse>('/v1/auth/login/admin', { empId, password });

        // 🚧 Mock 回傳 (測試用，串接時請移除並打開上面那行)
        return new Promise<AuthResponse>((resolve) => {
            setTimeout(() => resolve({
                token: 'mock-admin-token',
                user: { id: empId, name: 'Admin User', role: 'admin' }
            }), 1000);
        });
    },

    // 廠商登入
    loginVendor: async (taxId: string, password: string) => {
        // return v1Api.post<AuthResponse>('/v1/auth/login/vendor', { taxId, password });

        // 🚧 Mock 回傳
        return new Promise<AuthResponse>((resolve) => {
            setTimeout(() => resolve({
                token: 'mock-vendor-token',
                user: { id: taxId, name: 'Vendor Company', role: 'vendor' }
            }), 1000);
        });
    }
};