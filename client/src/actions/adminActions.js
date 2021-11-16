import axios from 'axios'
import { FEEDBACK_FORM_LOADING, GET_FEEDBACK_FORM, GET_STUDENTS, GET_TEACHERS, STUDENTS_LOADING, TEACHERS_LOADING } from './types';


export const getAllTeachers = () => dispatch => {
    setTeacherLoading();
    axios.get("/api/teachers/all")
    .then(res => {
        dispatch({
            type: GET_TEACHERS,
            payload: res.data
        })
    })
    .catch(err=>{
        console.log("error in fetching all teachers",err, err.response.data);
    })
}
export const getAllStudents = () => dispatch => {
    setStudentLoading();
    axios.get("/api/students/all")
    .then(res => {
        dispatch({
            type: GET_STUDENTS,
            payload: res.data
        })
    })
    .catch(err=>{
        console.log("error in fetching all students",err, err.response.data);
    })
}

export const getAllForms = () => dispatch => {
    setFormLoading();
    axios.get("/api/feedbackforms/all")
    .then(res => {
        dispatch({
            type: GET_FEEDBACK_FORM,
            payload: res.data.map(data =>{ 
                return {...data, ...data.teacher_details}
            })
        })
    })
    .catch(err=>{
        console.log("error in fetching all students",err, err.response.data);
    })
}

export const setFormLoading = () => {
    return {
        type: FEEDBACK_FORM_LOADING
    }
}

export const setTeacherLoading = () => {
    return {
        type: TEACHERS_LOADING
    }
}
export const setStudentLoading = () => {
    return {
        type: STUDENTS_LOADING
    }
}


