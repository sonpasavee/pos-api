import type { Request , Response , NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validate(schema: ZodSchema) {
    return ( req: Request , res: Response , next: NextFunction ) => {
        const result = schema.safeParse(req.body)

        if(result.success){
            req.body = result.data
            next()  
        }else{
            res.status(400).json({ message: 'INVALID_REQUEST' })
        }
    }
}