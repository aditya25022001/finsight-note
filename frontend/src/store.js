import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { registerReducer, loginReducer } from './reducers/authReducers' 
import { addNoteReducer, showNotesReducer, updateNoteReducer } from './reducers/noteReducers'

const reducer = combineReducers({
    userRegister : registerReducer,
    userLogin : loginReducer,

    userAddNote : addNoteReducer,
    userShowNotes : showNotesReducer,
    userUpdateNote : updateNoteReducer
})

const userInfoFromStorage = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null

const initialState = {
    userLogin : { userInfo : userInfoFromStorage }
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware))) 

export default store