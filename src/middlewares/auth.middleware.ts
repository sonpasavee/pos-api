import type {  Request, Response, NextFunction} from 'express'
import { verifyToken } from '../lib/jwt'

export async function requireAuth( req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization
    
    if(!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
        req.user = await verifyToken(auth.split(' ')[1])
        next()
    } catch {
        res.status(401).json({ message: 'INVALID_TOKEN' })
    }
}