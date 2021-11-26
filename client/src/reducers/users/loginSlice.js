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
            localStorage.setItem("userInfo",JSON.stringify(data))
            return data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const logoutAction = createAsyncThunk(
    'user/logout',
    async () => {
        localStorage.removeItem('userInfo')
    }
)

export const loginSlice = createSlice({
    name:"userLogin",
    initialState:{
        loading: false,
        error:"",
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
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
        },
        [logoutAction.pending]:(state) => {
            state.loading=true
        },
        [logoutAction.fulfilled]:(state) => {
            state.loading=false
            state.userInfo=null
        },
        [logoutAction.rejected]:(state) => {
            state.loading=false
            state.error="Error logging out"
        }
    }
})

export default loginSlice.reducer