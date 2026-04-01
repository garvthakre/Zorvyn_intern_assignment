import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { requireRole } from '../../middleware/requireRole.js'
import { validate } from '../../middleware/validate.js'
import { updateRoleSchema, updateStatusSchema } from './users.validator.js'
import * as UsersController from './users.controller.js'

const router = Router()

// All admin only
router.get('/',                  authenticate, requireRole('admin'), UsersController.getAllUsers)
router.get('/:id',               authenticate, requireRole('admin'), UsersController.getUserById)
router.patch('/:id/role',        authenticate, requireRole('admin'), validate(updateRoleSchema),   UsersController.updateUserRole)
router.patch('/:id/status',      authenticate, requireRole('admin'), validate(updateStatusSchema), UsersController.updateUserStatus)
router.delete('/:id',            authenticate, requireRole('admin'), UsersController.deleteUser)

export default router