import { z } from 'zod'

export const createOrderSchema = z.object({
    tableId: z.string().cuid(),
    note: z.string().max(300).optional(),
    lineUserId: z.string().optional(),  // เพิ่ม
    lineName: z.string().optional(),  // เพิ่ม
    items: z.array(z.object({
        menuItemId: z.string().cuid(),
        quantity: z.number().int().min(1).max(99),
    })).min(1),
})

export const updateStatusSchema = z.object({
    status: z.enum(["CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"])
})
