import { prisma } from '../lib/db'
import type { z } from 'zod'
import type {
    createMenuItemSchema,
    updateMenuItemSchema,
} from '../validators/menu.validator'

type CreateInput = z.infer<typeof createMenuItemSchema>
type UpdateInput = z.infer<typeof updateMenuItemSchema>

export const menuService = {
    async getAll(restaurantId: string) {
        return prisma.menuItem.findMany({
            where: { restaurantId },
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        })
    },

    async getPublic(restaurantId: string) {
        return prisma.menuItem.findMany({
            where: { restaurantId, available: true },
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        })
    },

    async create(restaurantId: string, data: CreateInput) {
        return prisma.menuItem.create({
            data: { ...data, restaurantId },
        })
    },

    async update(id: string, restaurantId: string, data: UpdateInput) {
        const item = await prisma.menuItem.findFirst({
            where: { id, restaurantId }
        })

        if (!item) {
            throw new Error('NOT_FOUND')
        }

        return prisma.menuItem.update({
            where: { id },
            data,
        })
    } , 
    async remove(id: string , restaurantId: string) {
        const item = await prisma.menuItem.findFirst({
            where: { id , restaurantId } , 
        })

        if(!item) {
            throw new Error('NOT_FOUND')
        }

        return prisma.menuItem.delete({
            where: { id } ,
        })
    }
}