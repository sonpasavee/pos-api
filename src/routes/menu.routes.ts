import { Router } from 'express'
import { menuController } from '../controllers/menu.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'
import { validate } from '../middlewares/validate.middleware'
import { createMenuItemSchema, updateMenuItemSchema } from '../validators/menu.validator'

const router = Router()

router.get(
    '/public/:restaurantId' ,
    menuController.getPublic
)

router.get(                                
    '/' ,                                   
    requireAuth ,
    requireRole('OWNER' , 'STAFF') ,                           
    menuController.getAll
)

router.post(
    '/' , 
    requireAuth , 
    requireRole('OWNER') , 
    validate(createMenuItemSchema) , 
    menuController.create
)

router.patch(
    '/:id' , 
    requireAuth , 
    requireRole('OWNER') , 
    validate(updateMenuItemSchema) , 
    menuController.update
)

router.delete(
    '/:id' , 
    requireAuth , 
    requireRole('OWNER') , 
    menuController.remove   
)

export default router