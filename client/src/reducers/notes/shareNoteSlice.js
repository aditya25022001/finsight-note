import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const shareNoteAction = createAsyncThunk(
    'user/sharenote',
    async ({ fromEmail, toEmails, link, id, access }, { rejectWithValue, getState }) => {
        const { userLogin : { userInfo } } = getState()
        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        try {
            const { data } = await axios.put(`/api/note/sharenote`, { fromEmail, toEmails, link, id, access } ,config) 
            return data
        } catch (error) {
            return rejectWithValue(error.response.data) 
        }
    }
)

const shareNoteSlice = createSlice({
    name:'userShareNote',
    initialState:{
        loading:false,
        error:null,
        success:false
    },
    extraReducers:{
        [shareNoteAction.pending]:(state) => {
            state.loading=true
        },
        [shareNoteAction.fulfilled]:(state, action) => {
            state.loading = false
            state.note = action.payload
            state.success = true
        },
        [shareNoteAction.rejected]:(state, action) => {
            state.loading=false
            state.error=action.payload.message
        } 
    }
}) 

export default shareNoteSlice.reducer