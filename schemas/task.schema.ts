import { z } from 'zod';

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    location: z.string(),
    status: z.enum(['pending', 'urgent', 'done']),
    deadline: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;