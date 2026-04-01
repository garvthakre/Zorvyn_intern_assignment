import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate.js'
import { requireRole } from '../../middleware/requireRole.js'
import { validate } from '../../middleware/validate.js'
import { createRecordSchema, updateRecordSchema } from './records.validator.js'
import * as RecordsController from './records.controller.js'

const router = Router()

// All authenticated users can read
router.get('/',     authenticate, RecordsController.getRecords)
router.get('/:id',  authenticate, RecordsController.getRecordById)

// Admin only — write operations
router.post('/',     authenticate, requireRole('admin'), validate(createRecordSchema), RecordsController.createRecord)
router.patch('/:id', authenticate, requireRole('admin'), validate(updateRecordSchema), RecordsController.updateRecord)
router.delete('/:id',authenticate, requireRole('admin'), RecordsController.deleteRecord)

export default router