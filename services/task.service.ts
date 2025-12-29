import {v1Api} from '@/lib/api-client';
import {TaskSchema, Task} from '@/schemas/task.schema';
import {z} from 'zod';

export const TaskService = {
    // 取得任務列表
    getTasks: async (): Promise<Task[]> => {
        const data = await v1Api.get('/tasks');
        // Zod 驗證：如果後端給的資料格式爛掉，這裡會噴錯保護你
        return z.array(TaskSchema).parse(data);
    },

    // 新增任務
    createTask: async (payload: { title: string; location: string }) => {
        return v1Api.post('/tasks', payload);
    }
};