import type { Request, Response } from 'express'
import { tableService } from '../services/table.service'

export const tableController = {
    async getAll(req: Request, res: Response) {
        try {
            const restaurantId = req.user?.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            const tables = await tableService.getAll(restaurantId)
            res.json(tables)
        } catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async getByQrToken(req: Request<{ token: string }>, res: Response) {
        try {
            const table = await tableService.getByQrToken(req.params.token)
            res.json(table)
        } catch (err: any) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async create(req: Request, res: Response) {
        try {
            const restaurantId = req.user?.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            const table = await tableService.create(
                restaurantId,
                req.body.number
            )
            res.status(201).json(table)
        } catch (err: any) {
            if (err.message === 'TABLE_EXISTS')
                return res.status(409).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async remove(req: Request<{ id: string }>, res: Response) {
        try {
            const restaurantId = req.user?.restaurantId
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }
            await tableService.remove(req.params.id, restaurantId)
            res.json({ success: true })
        } catch (err: any) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },
}