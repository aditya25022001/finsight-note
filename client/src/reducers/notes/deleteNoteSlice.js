import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const apiBaseURL = "https://notestuff.onrender.com"

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
            const { data } = await axios.delete(`${apiBaseURL}/api/note/deletenote/${id}`, config) 
            return data
        } catch (error) {
            return rejectWithValue(error.response.data) 
        }
    }
)

const deleteSlice = createSlice({
    name:'userDeleteNote',
    initialState:{
        loading:false,
        success:false,
        error:null,
        note:null
    },
    extraReducers:{
        [deleteNoteAction.pending]:(state) => {
            state.loading=true
        },
        [deleteNoteAction.fulfilled]:(state, action) => {
            state.loading=false
            state.success=true
            state.note=action.payload
        },
        [deleteNoteAction.rejected]:(state, action) => {
            state.loading=false
            state.error=action.payload.message
        }
    }
})

export default deleteSlice.reducer