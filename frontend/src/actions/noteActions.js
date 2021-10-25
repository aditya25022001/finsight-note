import { ADD_NOTE_REQUEST, ADD_NOTE_FAIL, ADD_NOTE_SUCCESS, SHOW_NOTES_REQUEST, SHOW_NOTES_FAIL, SHOW_NOTES_SUCCESS, UPDATE_NOTE_REQUEST, UPDATE_NOTE_FAIL, UPDATE_NOTE_SUCCESS, UPDATE_NOTE_RESET, ADD_NOTE_RESET } from "../constants/noteConstants";
import axios from 'axios'

export const addNoteAction = (heading, content, tags) => async (dispatch, getState) => {
    try {
        dispatch({
            type:ADD_NOTE_REQUEST
        })
        const { userLogin : { userInfo } } = getState()
        const config={
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.post('/api/note/add',{ heading, content, tags },config)
        dispatch({
            type:ADD_NOTE_SUCCESS,
            payload:data
        })
        setTimeout(() =>{
            dispatch({ type:ADD_NOTE_RESET })
        },3000)
    } catch (error) {
        dispatch({
            type:ADD_NOTE_FAIL,
            payload:error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const showNotesAction = () => async (dispatch, getState) => {
    try {
        dispatch({
            type:SHOW_NOTES_REQUEST
        })
        const { userLogin : { userInfo } } = getState()
        const config={
            headers:{
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.get('/api/note/getnotes',config)
        dispatch({
            type:SHOW_NOTES_SUCCESS,
            payload:data
        })
    } catch (error) {
        dispatch({
            type:SHOW_NOTES_FAIL,
            payload:error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateNoteAction = (id, heading, content,tags) => async (dispatch, getState) => {
    try {
        dispatch({
            type:UPDATE_NOTE_REQUEST
        })
        const { userLogin : { userInfo } } = getState()
        const config={
            headers:{
                'Authorization': `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.put('/api/note/updatenote',{ id, heading, content, tags },config)
        dispatch({
            type:UPDATE_NOTE_SUCCESS,
            payload:data
        })
        setTimeout(() =>{
            dispatch({ type:UPDATE_NOTE_RESET })
        },3000)
    } catch (error) {
        dispatch({
            type:UPDATE_NOTE_FAIL,
            payload:error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

