import { FEEDBACK_FORM_LOADING, GET_FEEDBACK_FORM, GET_STUDENTS, GET_TEACHERS, STUDENTS_LOADING, TEACHERS_LOADING } from '../actions/types';

const initialState ={
    teachers: [],
    students: [],
    teacher_loading: false,
    student_loading: false,
    
}

export default function(state =  initialState, action){

    switch(action.type){
        case GET_TEACHERS :
            return {
                ...state,//returning the current state
                teachers: action.payload,
                teacher_loading: false,
            }
        case GET_STUDENTS :
            return {
                ...state,//returning the current state
                students: action.payload,
                student_loading: false,
            }
        case GET_FEEDBACK_FORM :
            return {
                ...state,//returning the current state
                feedback_forms: action.payload,
                feedback_form_loading: false,
            }
        case TEACHERS_LOADING :
            return {
                ...state,
                teacher_loading: true,
            }
        case STUDENTS_LOADING :
            return {
                ...state,
                student_loading: true,
            }
        case FEEDBACK_FORM_LOADING :
            return {
                ...state,
                feedback_form_loading: true,
            }
        default:
            return state;   
    }
}