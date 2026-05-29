import type { Request, Response } from 'express'
import { orderService } from '../services/order.service'
import { io } from '../index'

export const orderController = {
    async getAll(req: Request<{ restaurantId: string }>, res: Response) {
        try {
            const restaurantId = req.user?.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            const orders = await orderService.getAll(restaurantId, req.query.status as string | undefined)
            return res.json(orders)
        } catch (err: any) {
            return res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async getById(req: Request<{ id: string, restaurantId: string }>, res: Response) {
        try {
            const order = await orderService.getById(req.params.id, req.params.restaurantId)
            res.json(order)
        } catch (err: any) {
            return res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async create(req: Request, res: Response) {
        try {
            const customerId = req.user?.role === 'CUSTOMER' ? req.user.userId : undefined
            const order = await orderService.create(req.body, customerId)
            io.to(`restaurant:${order.table.restaurantId}`).emit('order:new', order)
            res.status(201).json(order)
        } catch (err: any) {
            if (err.message === 'MENU_ITEM_UNAVAILABLE')
                return res.status(400).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },
    async updateStatus(req: Request<{ id: string, restaurantId: string }>, res: Response) {
        try {
            const restaurantId = req.user?.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            const order = await orderService.updateStatus(req.params.id, restaurantId, req.body)
            io.to(`restaurant:${order.table.restaurantId}`).emit('order:updated', order)
            return res.json(order)
        } catch (err: any) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async cancle(req: Request<{ id: string, restaurantId: string }>, res: Response) {
        try {
            const restaurantId = req.user!.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            const order = await orderService.cancle(req.params.id, restaurantId)
            io.to(`restaurant:${order.table.restaurantId}`).emit('order:updated', order)
            res.json(order)
        } catch (err: any) {
            const clientErrors = ['NOT_FOUND', 'CANNOT_CANCEL']
            if (clientErrors.includes(err.message))
                return res.status(400).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    } , 
}