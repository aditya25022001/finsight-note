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

export const registerSlice = createSlice({
    name:"userRegister",
    initialState:{
        loading: false,
        error:"",
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    },
    extraReducers:{
        [registerAction.pending]:(state) => {
            state.loading=true
        },
        [registerAction.fulfilled]:(state, action) => {
            state.loading=false
            state.userInfo=action.payload
        },
        [registerAction.rejected]:(state, action) => {
            state.loading=false
            state.error=action.payload.message    
        }
    }
})

export default registerSlice.reducer