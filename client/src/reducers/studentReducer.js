import { GET_FEEDBACK_FORM, FEEDBACK_FORM_LOADING } from '../actions/types';

const initialState ={
    feedbackForm: [],
    feedbackForm_loading: false,    
}

export default function(state =  initialState, action){
    switch(action.type){
        case GET_FEEDBACK_FORM :
            return {
                ...state,//returning the current state
                feedbackForm: action.payload,
                feedbackForm_loading: false,
            }
        case FEEDBACK_FORM_LOADING :
            return {
                ...state,
                feedbackForm_loading: true,
            }
         default:
             return state;   
    }
}