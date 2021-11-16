import React from 'react'
import { makeStyles } from '@material-ui/core';
import SideBar from './SideBar'

const styles = makeStyles(theme => ({
    section:{
        margin: theme.spacing(2),
    },
    sectionPaper:{
        padding:theme.spacing(2),
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        marginLeft: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(9) + 1,
        },
    },
}));


const Dashboard = () => {
    const classes = styles();
    return (
    <div className={classes.content}>
        <div className={classes.toolbar} />
        <SideBar />
        <div>
    </div>
    </div>
    )
}

export default Dashboard