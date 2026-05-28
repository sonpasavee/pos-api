import type { Request, Response } from 'express'
import { menuService } from '../services/menu.service'

export const menuController = {
    async getAll(req: Request, res: Response) {
        try {
            const restaurantId = req.user?.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            const items = await menuService.getAll(restaurantId)
            res.json(items)
        } catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async getPublic(req: Request<{ restaurantId: string }>, res: Response) {
        try {
            const items = await menuService.getPublic(req.params.restaurantId)
            res.json(items)
        } catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async create(req: Request, res: Response) {
        try {
            const restaurantId = req.user?.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            const item = await menuService.create(restaurantId, req.body)
            res.status(201).json(item)
        } catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async update(req: Request<{ id: string }>, res: Response) {
        try {
            const restaurantId = req.user?.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            const item = await menuService.update(req.params.id, restaurantId, req.body)
            res.json(item)
        } catch (err: any) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async remove(req: Request<{ id: string }>, res: Response) {
        try {
            const restaurantId = req.user?.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            await menuService.remove(req.params.id, restaurantId)
            res.json({ success: true })
        } catch (err: any) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },
}