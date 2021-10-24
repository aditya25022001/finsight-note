import express from 'express'
import { addNote } from '../controllers/noteController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/add').post(authenticate, addNote)

export default router