import React, { useEffect, useState } from 'react'
import { Button, Container, createMuiTheme, FormControl, Grid, IconButton, InputLabel, makeStyles, MenuItem, Paper, Select, SwipeableDrawer, TextField, ThemeProvider, Tooltip, Typography } from '@material-ui/core';
import SideBar from '../SideBar'
import Divider from '@material-ui/core/Divider';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getAllStudents } from '../../../actions/adminActions';
import MUIDataTable from "mui-datatables";


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


const columns = [
    { name: '_id', label: 'ID', width: 150},
    { name: 'fname', label: 'First Name', width: 150},
    { name: 'lname', label: 'Last Name', width: 150},
    { name: 'division', label: 'Division', width: 150,},
    { name: 'rollno', label: 'Roll No.', width: 150},
    { name: 'mobile', label: 'Phone Number', width: 250, },
    { name: 'email', label: 'Email Address', width: 250,  },
    { name: 'yearofstudy', label: 'Year of Study', width: 550,  },
    { name: 'department', label: 'Department', width: 550,  },
];

// const rows = [
//     { id: 0, title: 'Example' },
//     { id: 1, title: 'Demo' }
// ];



const Students = () => {
    const classes = styles();
    const [open, setOpen] = useState(false);
    const [openType, setOpenType] = useState("none");
    const [selectedRowId, setSelectedRowId] = useState();
    
    const students = useSelector(state => state.admin.students);
    const dispatch = useDispatch();

    const toggleDrawer = (val) => (event) => {
        setOpen(val);
    };
    const initialStudent = {
        fname: "",
        lname: "",
        division: "",
        rollno: "",
        email: "",
        mobile: "",
        yearofstudy: "",
        department: "",
    }
    const [newStudent, setNewStudent] = useState(initialStudent);
    const [rows, setRows] = useState([]);

    const handleChange = (e) => {
        setNewStudent({
            ...newStudent,
            [e.target.name]: e.target.value
        });
    }

    const handleCancel = () => {
        setNewStudent(initialStudent);
        setOpen(false);
    }

    const handleSubmit = () => {
        if(openType === "create"){
            axios.post("/api/students/create", newStudent)
            .then(res => {
                setNewStudent(initialStudent);
                setOpen(false);
                dispatch(getAllStudents());
            })
            .catch(err=>{
                console.log("error in fetching students",err, err.response.data);
            })
        }
        else if(openType === "edit"){
            console.log("reached edit",selectedRowId, newStudent)
            axios.post("/api/students/update/id", {id: selectedRowId, data:newStudent})
            .then(res => {
                setNewStudent(initialStudent);
                setOpen(false);
                dispatch(getAllStudents());
            })
            .catch(err=>{
                console.log("error in editting students",err, err.response.data);
            })
        }
    }


    const handleDelete = async(index) => {
        var ids = index.map(i => students[i]._id);

        console.log("reached handleDelete", ids);
        await axios.post("/api/students/delete/id", {id: ids})
            .then(res => {
                console.log("success delete");
                dispatch(getAllStudents())
            })
            .catch(err=>{
                console.log("error while deleting student(s)",err, err.response.data);
            })
      };
    
    const handleEdit = (index) => {
        console.log("reached handleEdit with index",index)
        setSelectedRowId(students[index]._id)
        var tempData = students[index];
        delete tempData.__v;
        delete tempData._id;
        delete tempData.ratings;
        delete tempData.timestamp;
        
        setNewStudent(tempData)
        setOpenType('edit');
        setOpen(true);
    };

    
    useEffect(() => {
        dispatch(getAllStudents());
    }, []);

    useEffect(() => {
        console.log(newStudent);
    }, [newStudent]);


    const options = {
        filterType: 'dropdown',
        responsive: 'standard',
        customToolbarSelect: (selectedRows) => {
            var index = selectedRows.data.map(i => i.dataIndex)
            
            return <div className={classes.iconContainer}>
            { (index.length == 1) && <Tooltip title={"Edit"}>
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
                        title={"All Students list"} 
                        data={students} 
                        columns={columns} 
                        options={options} 
                    />

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
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <TextField
                                                    id="fname"
                                                    name="fname"
                                                    fullWidth
                                                    className={classes.formControl}
                                                    label="First Name"
                                                    // defaultValue=""
                                                    value={newStudent.fname}
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
                                                    value={newStudent.lname}
                                                    helperText="Last Name"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <TextField
                                                    id="division"
                                                    name="division"
                                                    fullWidth
                                                    className={classes.formControl}
                                                    label="Division"
                                                    value={newStudent.division}
                                                    helperText="Division"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    id="rollno"
                                                    name="rollno"
                                                    fullWidth
                                                    className={classes.formControl}
                                                    label="Roll no."
                                                    value={newStudent.rollno}
                                                    helperText="Roll no."
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
                                                    value={newStudent.email}
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
                                                    value={newStudent.mobile}
                                                    helperText="Phone Number"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} justify="space-between">
                                            <Grid item xs={12} sm={6} className={classes.formControl}>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <InputLabel id="yearofstudy-label">Year of Study</InputLabel>
                                                    <Select
                                                        labelId="yearofstudy-label"
                                                        id="yearofstudy"
                                                        name="yearofstudy"
                                                        fullWidth
                                                        value={newStudent.yearofstudy}
                                                        onChange={handleChange}
                                                        label="Year of Study"
                                                    >
                                                        <MenuItem value="FE">First Year</MenuItem>
                                                        <MenuItem value="SE">Second Year</MenuItem>
                                                        <MenuItem value="TE">Third Year</MenuItem>
                                                        <MenuItem value="BE">Fourth Year</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} className={classes.formControl}>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <InputLabel id="department-label">Department</InputLabel>
                                                    <Select
                                                        labelId="department-label"
                                                        id="department"
                                                        name="department"
                                                        fullWidth
                                                        value={newStudent.department}
                                                        onChange={handleChange}
                                                        label="Age"
                                                        autoWidth={false}
                                                    >
                                                        <MenuItem value="CE">Computer Engineering (<em>Comps</em>)</MenuItem>
                                                        <MenuItem value="IT">Information Technology (<em>IT</em>)</MenuItem>
                                                        <MenuItem value="ME">Mechanical Engineering (<em>Mech</em>)</MenuItem>
                                                        <MenuItem value="Extc">Electronics & Telecommunication Engineering (<em>Extc</em>)</MenuItem>
                                                        <MenuItem value="ItT">Instrumentation Engineering (<em>Instru</em>)</MenuItem>
                                                    </Select>
                                                </FormControl>
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

export default Students