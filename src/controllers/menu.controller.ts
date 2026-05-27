import type { Request, Response } from 'express'
import { menuService } from '../services/menu.service'
import { removeAllListeners } from 'node:cluster'

export const menuController = {
    async getAll(req: Request, res: Response) {
        try {
            const items = await menuService.getAll(req.user!.restaurantId)
            res.json(items)
        } catch (err: any) {
            res.status(400).json({ message: err.message || 'FAILED_TO_FETCH' })
        }
    },

    async getPublic(req: Request<{ restaurantId: string }>, res: Response) {
        try {
            const { restaurantId } = req.params
            const items = await menuService.getPublic(restaurantId)
            return res.json(items)
        } catch (err: any) {
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async create(req: Request, res: Response) {
        try {
            const item = await menuService.create(req.user!.restaurantId, req.body)
            return res.status(201).json(item)
        } catch (err: any) {
            res.status(400).json({ message: err.message || 'FAILED_TO_CREATE' })
        }
    },

    async update(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params
            const items = await menuService.update(
                id,
                req.user!.restaurantId,
                req.body
            )

            res.json(items)
        } catch (err: any) {
            res.status(400).json({ message: err.message || 'FAILED_TO_UPDATE' })
        }
    },

    async remove(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params
            await menuService.remove(id, req.user!.restaurantId)
            res.json({ success: true })
        } catch (err: any) {
            res.status(400).json({ message: err.message || 'FAILED_TO_DELETE' })
        }
    }


}