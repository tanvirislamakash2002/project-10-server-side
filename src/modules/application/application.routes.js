import express from 'express'
import { applicationController } from './application.controller.js'

const router = express.Router()

router.post('/', applicationController.application)

export const applicationRoutes = router