import express from 'express'
import { addNote, getNotes, updateNote } from '../controllers/noteController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/add').post(authenticate, addNote)

router.route('/getnotes').get(authenticate, getNotes)

router.route('/updatenote').put(authenticate, updateNote)

export default router