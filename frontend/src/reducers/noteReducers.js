import { ADD_NOTE_REQUEST, ADD_NOTE_FAIL, ADD_NOTE_SUCCESS } from '../constants/noteConstants'

export const addNoteReducer = (state={},action) => {
    switch(action.type){
        case ADD_NOTE_REQUEST:
            return {
                loading:true
            }
        case ADD_NOTE_SUCCESS:
            return{
                loading:false,
                success:true,
                note:action.payload
            }
        case ADD_NOTE_FAIL:
            return{
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}