import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { registerSchema, loginSchema } from '../validators/auth.validator'

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login',    validate(loginSchema),    authController.login)
router.get('/me',        requireAuth,              authController.me)

export default router