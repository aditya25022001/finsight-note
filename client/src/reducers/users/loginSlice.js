import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const loginAction = createAsyncThunk(
    'user/login',
    async ({email, password},{ rejectWithValue }) => {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        try {
            const { data } = await axios.post('/api/auth/login',{ email, password }, config)
            sessionStorage.setItem("userInfo",JSON.stringify(data))
            return data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const loginSlice = createSlice({
    name:"userLogin",
    initialState:{
        loading: false,
        error:"",
        userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null
    },
    extraReducers:{
        [loginAction.pending]:(state) => {
            state.loading=true
        },
        [loginAction.fulfilled]:(state, action) => {
            state.loading=false
            state.userInfo=action.payload
        },
        [loginAction.rejected]:(state, action) => {
            state.loading=false
            state.error=action.payload.message    
        }
    }
})

export default loginSlice.reducer