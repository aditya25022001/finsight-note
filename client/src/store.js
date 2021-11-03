import { configureStore } from '@reduxjs/toolkit'
import registerReducer from './reducers/users/registerSlice'
import loginReducer from './reducers/users/loginSlice'
import addNoteReducer from './reducers/notes/addNoteSlice'
import showNotesReducer from './reducers/notes/showNoteSlice'
import deleteNoteReducer from './reducers/notes/deleteNoteSlice'
import updateNoteReducer from './reducers/notes/updateNoteSlice'

export const store = configureStore({
    reducer:{
        userRegister : registerReducer,
        userLogin : loginReducer,
        userAddNote : addNoteReducer,
        userShowNotes : showNotesReducer,
        userDeleteNote : deleteNoteReducer,
        userUpdateNote : updateNoteReducer
    }
})