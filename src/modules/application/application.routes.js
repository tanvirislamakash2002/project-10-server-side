import express from 'express'
import { applicationController } from './application.controller.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware.protect, applicationController.application)
router.get('/', authMiddleware.protect, applicationController.ifApplicationExist)

export const applicationRoutes = router