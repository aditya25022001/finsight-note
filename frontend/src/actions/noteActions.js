import { ADD_NOTE_REQUEST, ADD_NOTE_FAIL, ADD_NOTE_SUCCESS } from "../constants/noteConstants";
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
    } catch (error) {
        dispatch({
            type:ADD_NOTE_FAIL,
            payload:error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}