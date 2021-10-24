import { ADD_NOTE_REQUEST, ADD_NOTE_FAIL, ADD_NOTE_SUCCESS, SHOW_NOTES_REQUEST, SHOW_NOTES_FAIL, SHOW_NOTES_SUCCESS } from '../constants/noteConstants'

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

export const showNotesReducer = (state={notes:[]},action) => {
    switch(action.type){
        case SHOW_NOTES_REQUEST:
            return {
                loading:true
            }
        case SHOW_NOTES_SUCCESS:
            return{
                loading:false,
                notes:action.payload.notes
            }
        case SHOW_NOTES_FAIL:
            return{
                loading:false,
                error:action.payload
            }
        default:
            return state
    }
}