import express from 'express'
import { applicationController } from './application.controller.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware.protect, applicationController.submitApplication)
router.get('/', authMiddleware.protect, applicationController.ifApplicationExist)
router.get('/my-applications', authMiddleware.protect, applicationController.getMyApplications)

export const applicationRoutes = router