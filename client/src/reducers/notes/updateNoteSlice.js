import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiBaseURL = "https://notestuff.onrender.com"

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
            const { data } = await axios.put(`${apiBaseURL}/api/note/updatenote`,{id, heading, content, tags},config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const updateNoteSlice = createSlice({
    name:'userUpdateNote',
    initialState:{
        loading:false,
        error:null,
        note:null,
        success:false
    },
    extraReducers:{
        [updateNoteAction.pending]:(state) => {
            state.loading=true
        },
        [updateNoteAction.fulfilled]:(state, action) => {
            state.loading = false
            state.note = action.payload
            state.success = true
        },
        [updateNoteAction.rejected]:(state, action) => {
            state.loading=false
            state.error=action.payload.message
        } 
    }
}) 

export default updateNoteSlice.reducer