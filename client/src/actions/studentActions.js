import axios from 'axios'
import { GET_FEEDBACK_FORM, FEEDBACK_FORM_LOADING } from '../actions/types';

export const getFeedbackForm = () => dispatch => {
    setFeedbackFormLoading();
    axios.post("/api/feedbackforms/id", {id: '5fa8ee9517e7f23160011c37'})
        .then(res => {
            console.log(res.data)
            dispatch({
                type: GET_FEEDBACK_FORM,
                payload: res.data
            })
        })
        .catch(err=>{
            console.log("error in fetching 5fa8ee9517e7f23160011c37 feedback",err, err.response.data);
        })
}

export const setFeedbackFormLoading = () => dispatch => {
    dispatch({
        type: FEEDBACK_FORM_LOADING,
        payload: true
    })
}