import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const showNotesAction = createAsyncThunk(
    'user/showNotes',
    async (id,{rejectWithValue, getState}) => {
        const { userLogin : { userInfo } } = getState()
        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        try {
            const { data } = await axios.get('/api/note/getnotes',config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)            
        }
    }
)

export const addNoteAction = createAsyncThunk(
    'user/addnote',
    async ({heading, content, tags},{rejectWithValue, getState}) => {
        const { userLogin : { userInfo } } = getState()
        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        try {
            const { data } = await axios.post('/api/note/add',{ heading, content, tags },config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateNoteAction = createAsyncThunk(
    'user/updatenote',
    async ({id, heading, content, tags},{rejectWithValue, getState}) => {
        const { userLogin : { userInfo } } = getState()
        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        try {
            const { data } = await axios.put('/api/note/updatenote',{id, heading, content, tags},config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteNoteAction = createAsyncThunk(
    'user/deletenote',
    async (id, { rejectWithValue, getState }) => {
        const { userLogin : { userInfo } } = getState()
        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        try {
            const { data } = await axios.delete(`/api/note/deletenote/${id}`, config) 
            return data
        } catch (error) {
            return rejectWithValue(error.response.data) 
        }
    }
)

const noteSlice = createSlice({
    name:'userNote',
    initialState:{
        loadingShow:false,
        errorShow:null,
        notes:null,
        loadingAdd:false,
        errorAdd:false,
        noteAdd:null,
        successAdd:false,
        loadingUpdate:false,
        errorUpdate:null,
        noteUpdate:null,
        successUpdate:false,
        loadingDelete:false,
        errorDelete:null,
        successDelete:false,
        noteDelete:null
    },
    extraReducers:{
        [showNotesAction.pending]:(state) => {
            state.loadingShow=true
        },
        [showNotesAction.fulfilled]:(state, action) => {
            state.loadingShow=false
            state.notes=action.payload.notes
        },
        [showNotesAction.rejected]:(state, action) => {
            state.loadingShow=false
            state.errorShow= action.payload.message
        },
        [addNoteAction.pending]:(state) => {
            state.loadingAdd=true
        },
        [addNoteAction.fulfilled]:(state, action) => {
            state.loadingAdd = false
            state.noteAdd = action.payload
            state.successAdd=true
        },
        [addNoteAction.rejected]:(state, action) => {
            state.loadingAdd=false
            state.errorAdd=action.payload.message
        },
        [updateNoteAction.pending]:(state) => {
            state.loadingUpdate=true
        },
        [updateNoteAction.fulfilled]:(state, action) => {
            state.loadingUpdate = false
            state.noteUpdate = action.payload
            state.successUpdate = true
        },
        [updateNoteAction.rejected]:(state, action) => {
            state.loadingUpdate=false
            state.errorUpdate=action.payload.message
        },
        [deleteNoteAction.pending]:(state) => {
            state.loadingDelete=true
        },
        [deleteNoteAction.fulfilled]:(state, action) => {
            state.loadingDelete=false
            state.successDelete=true
            state.noteDelete=action.payload
        },
        [deleteNoteAction.rejected]:(state, action) => {
            state.loadingDelete=false
            state.errorDelete=action.payload.message
        } 
    }
})

export default noteSlice.reducer