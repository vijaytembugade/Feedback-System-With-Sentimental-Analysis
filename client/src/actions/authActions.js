import {GET_ERRORS,SET_CURRENT_USER} from './types'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
//register user

// export const registerAdmin = (userData,history)=> dispatch=>{
//     console.log("ion aut ",userData)
//     axios.post('/api/auth/admin/register',userData)
//         .then(res => history.push("/login"))
//         .catch(err=>{
//             console.log("error in register user",err.response.data.message[0])
//             dispatch({
//                 type:GET_ERRORS,
//                 payload:err.response.data
//             })
//         })
// }


//login get user token
export const loginAdmin = (userData)=> dispatch=>{
  
  console.log("login in auth action",userData)
  axios.post("/api/auth/admin/login",userData)
  .then(res=>{

  
    //save to local storage
    const { token } = res.data;
    //set token to local storage
    localStorage.setItem('jwtToken',token)

    // set it to the auth header
    setAuthToken(token) // token contain the detail of the user like name, id , avatar etc
    //so need to decode using jwt decode to get user data

    const decoded = jwt_decode(token)

    //set currnet user
    dispatch(setCurrentUser(decoded))
    

  })
  .catch(err=> 
    {
      console.log('error => ' , err.response.data);
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    }
 )
}

export const loginStudent = (details)=> dispatch=>{
  
  console.log("login in auth action for student",details)
  
  //save to local storage
  const { token } = details;
  //set token to local storage
  localStorage.setItem('jwtToken',token)

  // set it to the auth header
  setAuthToken(token) // token contain the detail of the user like name, id , avatar etc
  //so need to decode using jwt decode to get user data

  const decoded = jwt_decode(token)

  //set currnet user
  dispatch(setCurrentUser(decoded))
}

//set logged in user
export const setCurrentUser = (decoded)=>{
  return {
    type: SET_CURRENT_USER,
    payload:decoded
  }
}

//log user out
export const logoutUser =()=> dispatch=>{

  // remove token from localstorage
  localStorage.removeItem('jwtToken')
  //remove auth header for future request
  setAuthToken(false)
  console.log('reacher logout')
  //set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}))
}