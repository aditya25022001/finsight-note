import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiBaseURL = "https://notestuff.onrender.com"

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
            const { data } = await axios.get(`${apiBaseURL}/api/note/getnotes`,config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)            
        }
    }
)

const showNotesSlice = createSlice({
    name:'userShowNotes',
    initialState:{
        loading:false,
        error:null,
        notes:[],
        success:false
    },
    extraReducers:{
        [showNotesAction.pending]:(state) => {
            state.loading=true
        },
        [showNotesAction.fulfilled]:(state, action) => {
            state.loading=false
            state.notes=action.payload.notes
            state.success=true
        },
        [showNotesAction.rejected]:(state, action) => {
            state.loading=false
            state.error= action.payload.message
        }
    }
})

export default showNotesSlice.reducer