import mongoose from 'mongoose'

const noteSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    noteHeading:{
        type:String,
        required:true,
    },
    noteContent:{
        type:String,
        required:true
    },
    noteTags:[{
        type:String
    }]
},{
    timestamps:true
})

const Note = mongoose.model('Note',noteSchema)
export default Note