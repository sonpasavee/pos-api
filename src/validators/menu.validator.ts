import { z } from 'zod'

export const createMenuItemSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    category: z.string().min(1),
    price: z.number().positive(),
    imageUrl: z.string().url().optional(),
    available: z.boolean().default(true),                       
})

export const updateMenuItemSchema = createMenuItemSchema.partial()