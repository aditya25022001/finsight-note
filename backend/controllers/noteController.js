import asyncHandler from 'express-async-handler'
import Note from '../models/noteModel.js'
import User from '../models/userModel.js'

const addNote = asyncHandler(async(req, res) => {
    const { heading, content, tags } = req.body
    const newNote = new Note({
        noteHeading: heading,
        noteContent: content,
        noteTags: tags,
        user: req.user._id,
    })
    const createNote = await newNote.save()
    const user = await User.findById(req.user._id)
    if(user){
        user.name = user.name
        user.email = user.email
        user.password = user.password
        user.notes = [...user.notes, createNote._id]
    }
    const updatedUser = await user.save()
    res.status(201).json({ 
        message:"Note saved successfully",
        userId : updatedUser._id,
        noteId : createNote._id,
        userNotes : updatedUser.notes,
    })
})

const getNotes = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const notes = await Note.find({ user:userId })
    if(notes.length>0){
        res.status(200).json({
            message:"Found",
            notes:notes
        })
    }
    else{
        res.json({
            message:"No notes until now"
        })
    }
})

export { addNote, getNotes }