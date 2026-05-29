import { Router } from 'express'
import { orderController } from '../controllers/order.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'
import { validate } from '../middlewares/validate.middleware'
import { createOrderSchema, updateStatusSchema } from '../validators/order.validator'


const router = Router()

// public - customer สั่งผ่าน QR
router.post(
    '/' , 
    validate(createOrderSchema) , 
    orderController.create
)

router.get(
    '/' , 
    requireAuth , 
    requireRole('OWNER' , 'STAFF') , 
    orderController.getAll
)

router.get(
    '/:id' , 
    requireAuth , 
    requireRole('OWNER' , 'STAFF') , 
    orderController.getById
)

router.patch(
    '/:id/status' , 
    requireAuth , 
    requireRole('OWNER' , 'STAFF') , 
    validate(updateStatusSchema) , 
    orderController.updateStatus
)

router.patch(
    '/:id/cancel' , 
    requireAuth , 
    requireRole('OWNER' , 'STAFF') , 
    orderController.cancle
)


export default router