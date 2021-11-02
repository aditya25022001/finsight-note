import { configureStore } from '@reduxjs/toolkit'
import registerReducer from './reducers/users/registerSlice'
import loginReducer from './reducers/users/loginSlice'

export const store = configureStore({
    reducer:{
        userRegister : registerReducer,
        userLogin : loginReducer
    }
})