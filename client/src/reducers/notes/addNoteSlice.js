import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

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

const addNoteSlice = createSlice({
    name:'userAddNote',
    initialState:{
        loading:false,
        error:null,
        note:null
    },
    extraReducers:{
        [addNoteAction.pending]:(state) => {
            state.loading=true
        },
        [addNoteAction.fulfilled]:(state, action) => {
            state.loading = false
            state.note = action.payload
        },
        [addNoteAction.rejected]:(state, action) => {
            state.loading=false
            state.error=action.payload.message
        } 
    }
}) 

export default addNoteSlice.reducer