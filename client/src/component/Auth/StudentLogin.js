import { Button, Grid, TextField, Typography, fade, makeStyles, Divider, Popover } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStudent } from '../../actions/authActions';
import Recaptcha from 'react-recaptcha';

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
  

  
const useStylesRedditInput = makeStyles((theme) => ({
    root: {
      border: '1px solid #e2e2e1',
      overflow: 'hidden',
      borderRadius: 4,
      backgroundColor: '#fcfcfb',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:hover': {
        backgroundColor: '#fff',
      },
      '&$focused': {
        backgroundColor: '#fff',
        boxShadow: `${fade('#0A66C2', 0.25)} 0 0 0 2px`,
        borderColor: '#0A66C2',
      },
    },
    focused: {},
}));


const StudentLogin = (props) => {
    const classes = useStyles();

    const [openPopover, setOpenPopover ] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [ details, setDetail ] = useState({});
    const [isValid, setIsValid] = useState({ status: undefined });
    const authDetails = useSelector(state => state.auth);
    const [ recaptchaState, setRecaptchaState ] = useState(false);

    const history = useHistory()
    const dispatch = useDispatch()

    const textFieldClasses = useStylesRedditInput();

    useEffect(() => {
        if(authDetails.isAuthenticated && authDetails.user.data.role ==="student")
        history.push('/student/feedback-form', { "details": isValid.details });
    })

    useEffect(() => {
        console.log(props.match.params.hash_string)
        setDetail({
            ...details,
            "hash_string": props.match.params.hash_string
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if(true){
            setIsValid({status: 0})
            axios.post('/api/auth/student/login', details)
                .then(res => {
                    dispatch(loginStudent(res.data))
                    setIsValid({ status: 1, details: res.data})
                })
                .catch(err => {
                    setIsValid({ status: -1, details: err.response.data.message })
                    // console.log(err.response.data.message)
                })
        }
        else{
            alert("Recaptcha not verified")
        }
    }

    const recaptchaLoaded = () => {
        console.log('recaptch loaded');
    }

    const verifyRecaptcha = (response) => {
        if(response){
            setRecaptchaState(true)
        }
        else{
            setRecaptchaState(false)
        }
    }

    // useEffect(() => {
    //     console.log(isValid.status)
    //     if(isValid.status === 1){
    //         console.log("redirecting...")
    //         history.push('/student/feedback-form', { "details": isValid.details });
    //     }
    // }, [isValid.status])

    return (
        <div>
            <Grid container direction="row" justify='center' alignItems='center' style={{height:'100vh',}}>
                <Grid container direction='column' style={{width: '400px', background: '#fff', borderRadius: '10px', padding: '40px 20px' }}>
                    <Grid item xs={12}>
                        <Typography style={{fontSize: '24px', lineHeight: '1.33333', fontWeight: '600', color: 'rgba(0,0,0,0.9)', padding: '0 0 4px 0'}}>
                            Help Us Grow!!
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{fontSize: '12px', lineHeight: '1.75', fontWeight: '400', color: 'rgba(0,0,0,0.6)', paddingBottom: '32px' }}>
                            Your one feedback can't change the world, but can motivate others to bring the change. So, don't miss your opportunity to bring the change.
                            {(isValid.status == 0 || isValid.status == -1 ) ? <span style={{color: 'rgba(256,0,0,1)', paddingTop: "10px"}}><br></br>{isValid.details}</span> : ""}
                        </Typography>
                    </Grid>                   
                    <Grid item xs={12}>
                        <TextField InputProps={{ classes: textFieldClasses, disableUnderline: true }}
                            label="Enter Password"
                            variant="filled"
                            id="password-field"
                            onChange={(e) => {
                                e.preventDefault();
                                setDetail({
                                    ...details,
                                    "password": e.target.value
                                })
                                
                            }}
                            style={{ width: '100%', marginBottom: '12px' }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Recaptcha
                            sitekey="6LcrJvkZAAAAAMgd7mNYwyV9z7BCkChzsTXKNjIU"
                            onloadCallback={recaptchaLoaded}
                            verifyCallback={verifyRecaptcha}
                        />
                    </Grid> 

                    <Grid item xs={12}>
                        <Button variant='contained' onClick={(e) => handleSubmit(e)} className={classes.primaryButton} style={{width: '100%', fontSize: '16px', lineHeight: '1.75', fontWeight: '400', marginTop: '8px' }} >
                            Sign in
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button  color='primary' aria-describedby='popOver' className={classes.standardButton} style={{width: '100%', fontSize: '14px', lineHeight: '1.75', fontWeight: '400', marginTop: '8px' }}
                            onClick={(e)=>{
                                setAnchorEl(e.currentTarget);
                                setOpenPopover(true)
                                }} 
                            >
                            Forgot password
                        </Button>
                        <Popover
                            id='popOver'
                            open={openPopover} 
                            anchorEl={anchorEl}
                            onClose={() => {
                                setAnchorEl(null);
                                setOpenPopover(false)
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            >
                            <Typography className={classes.popoverContent}>You will find a password in the mail containing this link.</Typography>
                        </Popover>
                    </Grid>
                    
                </Grid>
            </Grid>
        </div>
    )
}

export default StudentLogin
