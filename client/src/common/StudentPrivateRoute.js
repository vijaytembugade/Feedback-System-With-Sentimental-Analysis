import React from 'react'
import {Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux' // connects a react component to react store 
import PropTypes from 'prop-types'

const StudentPrivateRoute = ({component: Component, auth, ...rest})=> (
 <Route 
   {...rest} 
   render = {props=>
     (auth.isAuthenticated  === true && auth.user.data.role ==="student") ?(
         <Component {...props} />
       ) :
       (
         <Redirect to ={{pathname: '/student/error', state:{ details: {error_code: "401", error_desc: "Forbidden Access", error_message: "Click the link you got in the mail and login again. \nSorry for the inconvenience caused to you."}}}} />
       )
 }
 />
)


StudentPrivateRoute.propTypes = {
    auth:PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    auth:state.auth
})


export default connect(mapStateToProps)(StudentPrivateRoute)
