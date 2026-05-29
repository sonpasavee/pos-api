import { prisma } from '../lib/db'
import type { z } from 'zod'
import {
    createOrderSchema,
    updateStatusSchema,
} from '../validators/order.validator'
import { table } from 'node:console'
import { stat } from 'node:fs'

type CreateInput = z.infer<typeof createOrderSchema>
type UpdateStatusInput = z.infer<typeof updateStatusSchema>

const orderInclude = {
    items: { include: { menuItem: true } },
    table: true,
    payment: true
} as const

export const orderService = {
    async getAll(restaurantId: string, status?: string) {
        return prisma.order.findMany({
            where: {
                table: { restaurantId },
                ...(status ? { status: status as any } : {})
            },
            include: orderInclude,
            orderBy: { createdAt: 'desc' }
        })
    },

    async getById(id: string, restaurantId: string) {
        const order = await prisma.order.findFirst({
            where: { id, table: { restaurantId } },
            include: orderInclude,
        })

        if (!order) {
            throw new Error('NOT_FOUND')
        }

        return order
    },

    async create(input: CreateInput , customerId?: string) {
        const menuItems = await prisma.menuItem.findMany({
            where: {
                id: { in: input.items.map((i) => i.menuItemId) },
                available: true
            },
        })

        if (menuItems.length !== input.items.length) {
            throw new Error('MENU_ITEM_UNAVAILABLE')
        }

        const total = input.items.reduce((sum, item) => {
            const menu = menuItems.find((m) => m.id === item.menuItemId)
            return sum + Number(menu!.price) * item.quantity
        }, 0)

        return prisma.order.create({
            data: {
                tableId: input.tableId,
                note: input.note,
                total,
                customerId,
                items: {
                    create: input.items.map((item) => {
                        const menu = menuItems.find((m) => m.id === item.menuItemId)!
                        return {
                            menuItemId: item.menuItemId,
                            quantity: item.quantity,
                            price: menu.price,
                        }
                    }),
                },
            },
            include: orderInclude,
        })

    } ,

    async updateStatus(
        id: string,
        restaurantId: string,
        input: UpdateStatusInput
    ) {
        const existing = await prisma.order.findFirst({
            where: { id , table: { restaurantId } }
        })

        if (!existing) {
            throw new Error('NOT_FOUND')
        }

        return prisma.order.update({
            where: { id } , 
            data: { status: input.status } ,
            include: orderInclude,
        })

    } , 

    async cancle(id: string , restaurantId: string) {
        const existing = await prisma.order.findFirst({
            where: { id , table: { restaurantId } }
        })

        if(!existing) {
            throw new Error('NOT_FOUND')
        }

        if(existing.status === 'COMPLETED' || existing.status === 'CANCELLED') {
            throw new Error('CANNOT_CANCEL_COMPLETED_OR_CANCELLED_ORDER')
        }

        return prisma.order.update({
            where: { id } , 
            data: { status: 'CANCELLED' } ,
            include: orderInclude,
        })
    } ,

}