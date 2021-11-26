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
        usersEdit: [req.user.email]
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
        noteHeading:createNote.noteHeading,
        noteContent : createNote.noteContent,
        noteTags : createNote.noteTags,
        updatedAt : createNote.updatedAt,
        usersEdit:createNote.usersEdit
    })
})

const getNotes = asyncHandler(async(req, res) => {
    const userId = req.user._id
    const notes = await Note.find({ user:userId }).sort({ 'updatedAt':-1 })
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

const updateNote = asyncHandler(async(req, res) => {
    const { id, heading, content, tags } = req.body
    const note = await Note.findById(id)
    if(note){
        note.noteHeading = heading || note.noteHeading
        note.noteContent = content || note.noteContent
        note.noteTags = tags || note.noteTags
        note.usersEdit= note.usersEdit
        note.user = note.user
        const updatedNote = await note.save()
        if(updatedNote){
            res.status(200).json({
                message:"Updated successfully",
                id : updatedNote._id,
                user : updatedNote.user 
            })
        }
    }
    else{
        res.status(404).json({ message:"Note not found" })
    }
})

const deleteNote = asyncHandler(async(req, res) => {
    const { id } = req.params
    const note = await Note.findById(id)
    if(note){
        const userId = note.user
        const user = await User.findById(userId)
        if(user){
            user.name = user.name
            user.email = user.email
            user.password = user.password
            user.notes = user.notes.filter(noteId => noteId.toString()!==id.toString())
            const updatedUser = await user.save()
            const updatedNotes = await note.remove()
            if(updatedUser && updatedNotes){
                res.status(200).json({
                    message:"Note deleted successfully",
                    ...updatedNotes
                })
            }
        }
    }
    else{
        res.status(404).json({ 
            message:"Note not found" 
        })
    }
})

const getNoteById = asyncHandler(async(req, res) => {
    const { id } = req.params
    const note = await Note.findById(id)
    if(note){
        res.status(200).json({
            message:"Note found",
            note:note
        })
    }
    else{
        res.status(404).json({
            message:"Note not found"
        })
    }
})

const shareNote = asyncHandler(async(req, res) => {
    const { fromEmail, toEmails, id, link, access } = req.body
    const note = await Note.findById(id)
    if(note && access==="Can edit"){
        note.noteHeading = note.noteHeading
        note.noteContent = note.noteContent
        note.noteTags = note.noteTags
        note.usersEdit = Array.from(new Set([...note.usersEdit, ...toEmails]))
        note.user = note.user
        const updatedNote = await note.save()
        if(updatedNote){
            res.status(200).json({
                message:"Shared successfully",
                id : updatedNote._id,
                user : updatedNote.user,
                from:fromEmail,
                link:link 
            })
        }
    }
    else{
        res.status(404).json({
            message:"Note not found"
        })
    }
})

export { addNote, getNotes, updateNote, deleteNote, getNoteById, shareNote }