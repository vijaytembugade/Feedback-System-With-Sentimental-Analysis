import { Button, Grid, TextField, Typography, fade, makeStyles, Divider, Popover } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStudent } from '../../actions/authActions';

const useStyles = makeStyles(theme => ({
    container: {
      display: "flex",
      alignItems: "center"
    },
    border: {
      borderBottom: "2px solid #cdcfd2",
      width: "100%"
    },
    content: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      fontWeight: 400,
      fontSize: 16,
      color: "#000000e6"
    },
    primaryButton: {
        backgroundColor: '#0A66C2',
        color: '#FFF',
        '&:hover': {
            backgroundColor: '#0052a4',
            color: '#FFF'
        }
    },
    standardButton: {
        // backgroundColor: '#0A66C2',
        color: '#0A66C2',
        '&:hover': {
            backgroundColor: '#0a66c20a',
            color: '#0A66C2'
        }
    },
    popoverContent: {
        padding: theme.spacing(2),
        maxWidth: "400px"
      },
}));
  



const StudentAuthError = (props) => {
    const classes = useStyles();
    const location = useLocation()
    const [ details, setDetail ] = useState((location.state)? location.state.details : undefined);
    const authDetails = useSelector(state => state.auth)

    const history = useHistory()
    const dispatch = useDispatch()


    // useEffect(() => {
    //     if(authDetails.isAuthenticated && authDetails.user.data.role ==="student")
    //     history.push('/student/feedback-form', { "details": isValid.details });
    // })



    return (
        <div>
            <Grid container direction="row" justify='center' alignItems='center' style={{height:'100vh',}}>
                <Grid container direction='column' style={{width: '400px', background: '#fff', borderRadius: '10px', padding: '40px 20px' }}>
                    <Grid item xs={12}>
                        <Typography style={{ textAlign: "left", fontSize: '24px', lineHeight: '1.33333', fontWeight: '600', color: 'rgba(0,0,0,0.9)', padding: '0 0 4px 0'}}>
                            {(details) ? details.error_code + ".  " + details.error_desc : "404. Page Not Found"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{ textAlign: "left", fontSize: '12px', lineHeight: '1.75', fontWeight: '400', color: 'rgba(0,0,0,0.6)',  }}>
                            Please contact your administration or your system provider.
                        </Typography>
                    </Grid>                    
                </Grid>
            </Grid>
        </div>
    )
}

export default StudentAuthError
