import type { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { prisma } from '../lib/db'

export const authController = {
    async register(req: Request, res: Response) {
        try {
            const result = await authService.register(req.body)
            return res.json(result)
        } catch (err: any) {
            if (err.message === 'EMAIL_TAKEN')
                return res.status(409).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body.email, req.body.password)
            return res.json(result)
        } catch (err: any) {
            if (err.message === 'USER_NOT_FOUND' || err.message === 'INVALID_PASSWORD')
                return res.status(401).json({ error: 'INVALID_CREDENTIALS' })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async me(req: Request, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user!.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    restaurantId: true,
                },
            })
            res.json(user)
        } catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    },

    async lineAuth(req: Request, res: Response) {
        try {
            const result = await authService.lineAuth(req.body.accessToken)
            res.json(result)
        } catch (err: any) {
            if (err.message === 'LINE_AUTH_FAILED')
                return res.status(401).json({ error: err.message })
            res.status(500).json({ error: 'INTERNAL_ERROR' })
        }
    } ,
}