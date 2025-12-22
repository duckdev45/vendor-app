import { z } from 'zod';

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    location: z.string(),
    status: z.enum(['pending', 'urgent', 'done']),
    deadline: z.string().optional(),
});

// 自動推導出 TypeScript 型別，不用手寫 interface
export type Task = z.infer<typeof TaskSchema>;