import { Router } from 'express'
import authRoutes  from './auth.routes'
import menuRoutes from './menu.routes'
import orderRoutes from './order.routes'
import tableRoutes from './table.routes'

const router = Router()

router.use(
    '/auth' , 
    authRoutes
)

router.use(
    '/menu' , 
    menuRoutes
)

router.use(
    '/tables' , 
    tableRoutes
)

router.use(
    '/orders' , 
    orderRoutes
)

export default router