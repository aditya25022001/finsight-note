import express from 'express'
import { addNote, getNotes, updateNote, deleteNote, getNoteById } from '../controllers/noteController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/add').post(authenticate, addNote)

router.route('/getnotes').get(authenticate, getNotes)

router.route('/getnote/:id').get(authenticate, getNoteById)

router.route('/updatenote').put(authenticate, updateNote)

router.route('/deletenote/:id').delete(authenticate, deleteNote)

export default router