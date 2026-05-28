import { Router } from 'express'
import { tableController } from '../controllers/table.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'
import { validate } from '../middlewares/validate.middleware'
import { createTableSchema } from '../validators/table.validator'

const router = Router()

router.get(
    '/qr/:token',
    tableController.getByQrToken
)

router.get(
    '/' , 
    requireAuth , 
    requireRole('OWNER' , 'STAFF') , 
    tableController.getAll
)

router.post(
    '/' , 
    requireAuth , 
    requireRole('OWNER') , 
    validate(createTableSchema) ,
    tableController.create
)

router.delete(
    '/:id' , 
    requireAuth , 
    requireRole('OWNER') , 
    tableController.remove
)

export default router