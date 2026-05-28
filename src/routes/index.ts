import { Router } from 'express'
import authRoutes  from './auth.routes'
import menuRoutes from './menu.routes'
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

export default router