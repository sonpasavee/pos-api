import { z } from 'zod'

export const registerSchema = z.object({
    restaurantName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export const lineAuthSchema = z.object({
    accessToken: z.string().min(1),
})