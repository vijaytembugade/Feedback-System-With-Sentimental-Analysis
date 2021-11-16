import React from 'react'
import {Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux' // connects a react component to react store 
import PropTypes from 'prop-types'

const AdminPrivateRoute = ({component: Component, auth, ...rest})=> (
 <Route 
   {...rest} 
   render = {props=>
     (auth.isAuthenticated  === true && auth.user.data.role ==="admin") ?(
         <Component {...props} />
       ) :
       (
         <Redirect to ="/admin-login" />
       )
 }
 />
)


AdminPrivateRoute.propTypes = {
    auth:PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    auth:state.auth
})


export default connect(mapStateToProps)(AdminPrivateRoute)
