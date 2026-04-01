import { Router } from 'express'
import { validate } from '../../middleware/validate.js'
import { authenticate } from '../../middleware/authenticate.js'
import { registerSchema, loginSchema } from './auth.validator.js'
import * as AuthController from './auth.controller.js'

const router = Router()

router.post('/register', validate(registerSchema), AuthController.register)
router.post('/login',    validate(loginSchema),    AuthController.login)
router.get('/me',        authenticate,             AuthController.getMe)

export default router