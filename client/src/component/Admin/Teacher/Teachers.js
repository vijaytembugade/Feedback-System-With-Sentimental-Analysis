import React, { useEffect, useState } from 'react'
import { Box, Button, Chip, Container, createMuiTheme, Grid, IconButton, makeStyles, MenuItem, Paper, SwipeableDrawer, TextField, ThemeProvider, Tooltip, Typography } from '@material-ui/core';
import SideBar from '../SideBar'
import Divider from '@material-ui/core/Divider';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import CustomizedHook from './SubjectInputField';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import MUIDataTable from "mui-datatables";
import { getAllTeachers } from '../../../actions/adminActions';
import CustomScrollbars from '../CustomScrollbars';
// import Example from './try'

const styles = makeStyles(theme => ({
    section: {
        margin: theme.spacing(2),
    },
    sectionPaper: {
        padding: theme.spacing(2),
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
        // flexGrow: 1,
        padding: theme.spacing(3),
        marginLeft: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(9) + 1,
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 90,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    swipeableDrawer: {
        paddingBottom: theme.spacing(5),
    },
    divider:{
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    subjectChip: {
        marginTop: theme.spacing(1),
    }
}));


const drawerTheme = createMuiTheme({
    overrides: {
        // Style sheet name ⚛️
        MuiDrawer: {
            // Name of the rule
            paper: {
                // Some CSS
                maxWidth: "550px",
                paddingTop: "10px",
                paddingBottom: "20px",
            },
        },
    },
});


// const rows = [
//     { id: 0, title: 'Example' },
//     { id: 1, title: 'Demo' }
// ];



const Teachers = () => {
    const classes = styles();
    const [open, setOpen] = useState(false);
    const [openType, setOpenType] = useState("none");
    const [selectedRowId, setSelectedRowId] = useState();

    const teachers = useSelector(state => state.admin.teachers);
    const dispatch = useDispatch();

    const toggleDrawer = (val) => (event) => {
        setOpen(val);
    };
    
    const initialTeacher = {
        designation: "Mr.",
        fname: "",
        lname: "",
        email: "",
        mobile: "",
        subjects: []
    }
    const [newTeacher, setNewTeacher] = useState(initialTeacher);

    const handleChange = (e) => {
        setNewTeacher({
            ...newTeacher,
            [e.target.name]: e.target.value
        });
    }

    const handleCancel = () => {
        setNewTeacher(initialTeacher);
        setOpen(false);
    }

    const handleSubmit = () => {
        if(openType === "create"){
            axios.post("/api/teachers/create", newTeacher)
            .then(res => {
                setNewTeacher(initialTeacher);
                setOpen(false);
                dispatch(getAllTeachers());
            })
            .catch(err=>{
                console.log("error in fetching teachers",err, err.response.data);
            })
        }
        else if(openType === "edit"){
            console.log("reached edit",selectedRowId, newTeacher)
            axios.post("/api/teachers/update/id", {id: selectedRowId, data:newTeacher})
            .then(res => {
                setNewTeacher(initialTeacher);
                setOpen(false);
                dispatch(getAllTeachers());
            })
            .catch(err=>{
                console.log("error in editting teachers",err, err.response.data);
            })
        }
    }

    useEffect(() => {
        dispatch(getAllTeachers())
    }, []);

    useEffect(() => {
        console.log(newTeacher);
    }, [newTeacher]);


    const handleDelete = async(index) => {
        var ids = index.map(i => teachers[i]._id);

        console.log("reached handleDelete", ids);
        await axios.post("/api/teachers/delete/id", {id: ids})
            .then(res => {
                console.log("success delete");
                dispatch(getAllTeachers())
            })
            .catch(err=>{
                console.log("error while deleting teacher(s)",err, err.response.data);
            })
      };
    
    const handleEdit = (index) => {
        console.log("reached handleEdit with index",index)
        setSelectedRowId(teachers[index]._id)
        var tempData = {
            designation: teachers[index].designation,
            fname: teachers[index].fname,
            lname: teachers[index].lname,
            email: teachers[index].email,
            mobile: teachers[index].mobile,
            subjects: teachers[index].subjects,
        }
        
        setNewTeacher(tempData)
        setOpenType('edit');
        setOpen(true);
      };

    const columns = [
        { name: '_id', label: 'ID', frozen: true, width: 150},
        { name: 'designation', label: 'Designation', frozen: true, width: 150,},
        { name: 'fname', label: 'First Name', frozen: true, width: 150},
        { name: 'lname', label: 'Last Name', frozen: true, width: 150},
        { name: 'mobile', label: 'Phone Number', width: 250, },
        { name: 'email', label: 'Email Address', width: 250,  },
        { name: 'subjects', label: 'Subjects', width: 550, options: {
            customBodyRender: (value, tableMeta, updateValue) => {
            // console.log(value)
            return <CustomScrollbars className=" scrollbar" style={{width: 400, height: 100, overflowX: "hidden"}}>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    p={1}
                    m={1}
                    // bgcolor="background.paper"
                    // css={{ maxWidth: 300}}
                >
                    
                    {value.map(val => (
                    // <Box  bgcolor="grey.300">
                        <Chip className={classes.subjectChip} label={val} />
                    // </Box>
                    ))
                }
                </Box>
            </CustomScrollbars>
            }
        }},
    ];

    const options = {
        filterType: 'dropdown',
        responsive: 'standard',
        customToolbarSelect: (selectedRows) => {
            var index = selectedRows.data.map(i => i.dataIndex)
            
            return <div className={classes.iconContainer}>
            { (index.length === 1) && <Tooltip title={"Edit"}>
              <IconButton onClick={async() => await handleEdit(index[0])}>
                <CreateIcon />
              </IconButton>
            </Tooltip>}
            <Tooltip title={"Delete"}>
              <IconButton onClick={async () => await  handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        }

    };

    return (
        <div className={classes.content}>
            <div className={classes.toolbar} />
            <SideBar />
            {/* <div> */}


                <Paper className={classes.sectionPaper} elevation={2} >
                    <Grid container direction="column" alignItems="flex-start" style={{marginBottom: "10px"}}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                onClick={() => { 
                                    setOpenType('create')
                                    setOpen(true) 
                                }}
                                startIcon={<PersonAddIcon />}
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                    <MUIDataTable 
                        title={"RGIT Teachers list"} 
                        data={teachers} 
                        columns={columns} 
                        options={options} 
                    />
                    {/* <Example /> */}
                </Paper>
            {/* </div> */}


            <ThemeProvider theme={drawerTheme}>
                <SwipeableDrawer
                    anchor={"right"}
                    className={classes.swipeableDrawer}
                    open={open}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}

                >

                        <Grid container direction="column" style={{height: "100%"}} justify="space-between">
                            <Grid item>
                                <Container>
                                    <Grid item >
                                        <Typography className={classes.formControl} variant="h5" gutterBottom>
                                            Add New Teacher
                                        </Typography>
                                        <Typography className={classes.formControl} style={{ wordWrap: "break-word" }} variant="caption" gutterBottom>
                                            Fill the details for adding new teacher & click <b>SUBMIT</b> button. Click <b>CANCEL</b> button to cancel the operation
                                        </Typography>
                                    </Grid>
                                </Container>
                                <Divider className={classes.divider} />
                                <Container>
                                    <Grid container direction="column">
                                        <Grid container justify="space-between" >
                                            <Grid item>
                                                <TextField
                                                    id="designation"
                                                    name="designation"
                                                    select
                                                    fullWidth
                                                    label="Select"
                                                    className={classes.formControl}
                                                    value={newTeacher.designation}
                                                    onChange={handleChange}
                                                    helperText="Designation"
                                                    variant="outlined"
                                                >
                                                    {[
                                                        {
                                                            value: 'Mr.',
                                                            label: 'Mr.',
                                                        },
                                                        {
                                                            value: 'Mrs.',
                                                            label: 'Mrs.',
                                                        },
                                                        {
                                                            value: 'Miss',
                                                            label: 'Miss',
                                                        },
                                                        {
                                                            value: 'Mast.',
                                                            label: 'Mast.',
                                                        },
                                                    ].map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <TextField
                                                    id="fname"
                                                    name="fname"
                                                    fullWidth
                                                    className={classes.formControl}
                                                    label="First Name"
                                                    // defaultValue=""
                                                    value={newTeacher.fname}
                                                    helperText="First Name"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    id="lname"
                                                    name="lname"
                                                    fullWidth
                                                    className={classes.formControl}
                                                    label="Last Name."
                                                    value={newTeacher.lname}
                                                    helperText="Last Name"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <TextField
                                                    id="email"
                                                    name="email"
                                                    fullWidth
                                                    className={classes.formControl}
                                                    label="Email"
                                                    value={newTeacher.email}
                                                    helperText="Email address"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    id="mobile"
                                                    name="mobile"
                                                    fullWidth
                                                    className={classes.formControl}
                                                    label="Phone no."
                                                    value={newTeacher.mobile}
                                                    helperText="Phone Number"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item className={classes.formControl}>
                                                <CustomizedHook value={newTeacher.subjects.map(val => {return {name: val}})} handleChange={(val) => {
                                                    setNewTeacher({
                                                        ...newTeacher,
                                                        "subjects": val
                                                    })
                                                }}/>
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                </Container>
                            </Grid>
                            <Grid item>
                                <Container>
                                    <Grid container spacing={2} justify="flex-end">
                                        <Grid item>
                                            <Button variant="outlined" color="secondary" onClick={() => handleCancel()}>
                                                Cancel
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </Grid>
                        </Grid>
                    
                </SwipeableDrawer>
            </ThemeProvider>
        </div>
    )
}

export default Teachers