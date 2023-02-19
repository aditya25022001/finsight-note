import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiBaseURL = "https://notestuff.onrender.com"

export const getNoteByIdAction = createAsyncThunk(
    'user/getNoteById',
    async (id,{rejectWithValue, getState}) => {
        const { userLogin : { userInfo } } = getState()
        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        try {
            const { data } = await axios.get(`${apiBaseURL}/api/note/getnote/${id}`,config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)            
        }
    }
)

const getNoteByIdSlice = createSlice({
    name:'userGetNoteById',
    initialState:{
        loading:false,
        error:null,
        note:{},
        success:false
    },
    extraReducers:{
        [getNoteByIdAction.pending]:(state) => {
            state.loading=true
        },
        [getNoteByIdAction.fulfilled]:(state, action) => {
            state.loading=false
            state.note=action.payload.note
            state.success=true
        },
        [getNoteByIdAction.rejected]:(state, action) => {
            state.success=false
            state.loading=false
            state.error= action.payload.message
        }
    }
})

export default getNoteByIdSlice.reducer