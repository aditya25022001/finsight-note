import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const registerAction = createAsyncThunk(
    'user/register',
    async({name, email, password},{rejectWithValue}) => {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        try {
            const { data } = await axios.post('/api/auth/register',{ name,email,password }, config)
            if(data){
                await axios.post('/api/auth/login',{ email,password }, config)
                localStorage.setItem("userInfo",JSON.stringify(data))
            }
            return data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

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

const userSlice = createSlice({
    name:'user',
    initialState:{
        loadingRegister:false,
        errorRegister:null,
        userInfoRegister:localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
        loadingLogin:false,
        errorLogin:null,
        userInfo:localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    },
    extraReducers:{
        [registerAction.pending]:(state) => {
            state.loadingRegister=true
        },
        [registerAction.fulfilled]:(state, action) => {
            state.loadingRegister=false
            state.userInfoRegister=action.payload
        },
        [registerAction.rejected]:(state, action) => {
            state.loadingRegister=false
            state.errorRegister=action.payload.message    
        },
        [loginAction.pending]:(state) => {
            state.loadingLogin=true
        },
        [loginAction.fulfilled]:(state, action) => {
            state.loadingLogin=false
            state.userInfo=action.payload
        },
        [loginAction.rejected]:(state, action) => {
            state.loadingLogin=false
            state.errorLogin=action.payload.message    
        },
        [logoutAction.pending]:(state) => {
            state.loadingLogin=true
        },
        [logoutAction.fulfilled]:(state) => {
            state.loadingLogin=false
            state.userInfo=null
        },
        [logoutAction.rejected]:(state) => {
            state.loadingLogin=false
            state.errorLogin="Error logging out"
        }
    }
})

export default userSlice.reducer