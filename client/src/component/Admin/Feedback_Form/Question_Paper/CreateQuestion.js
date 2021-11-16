import React, { useEffect, useState } from 'react'
import { Grid, Paper, TextField, makeStyles, FormControl, InputLabel, Select, MenuItem, ListItem, ListItemText, ListItemAvatar, Avatar, createMuiTheme, ThemeProvider, FormControlLabel, RadioGroup, Radio, Checkbox, FormGroup, Button, IconButton } from '@material-ui/core'

// Icons
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import ShortTextIcon from '@material-ui/icons/ShortText';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = makeStyles(theme => ({
    section: {
        margin: theme.spacing(2),
    },
    sectionPaper: {
        padding: theme.spacing(2),
    },
    questionField: {
        // maxWidth: "760px"
    },
    questionTypeSelector: {
        // maxHeight: "56px"
    },
    formControl: {
        margin: theme.spacing(1),
        // minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const selectButtonTheme = createMuiTheme({
    overrides: {
        // Style sheet name ⚛️
        MuiSelect: {
            // Name of the rule
            root: {
                // Some CSS
                padding: "4px 12px"
            },
        },
    },
});

const CreateQuestion = (props) => {
    const classes = styles();
    const initialQuestion = {
        question: "",
        optionType: "radiobutton",
        options: [],
        commment: "", 
    }


    const [ question, setQuestion ] = useState(initialQuestion);
    
    const handleChange = (e) => {
        setQuestion((oldQuestion) => {
            return {
            ...oldQuestion,
            [e.target.name]: e.target.value

        }})
    }

    useEffect(()=> {
        console.log("reached question useEffect")
        console.log(question)
        props.handleQuestion(props.index, question)
    },[question])


    
    return (
        <Paper  className={classes.sectionPaper}>
            <Grid container direction="column">
                <Grid container spacing={2} justify="space-between">
                    <Grid item xs={12} md={8}>
                    <TextField
                        id="question-text"
                        label="Question"
                        placeholder="Placeholder"
                        fullWidth
                        variant="filled"
                        className={[classes.formControl, classes.questionField].join(" ")}
                        value={question.question}
                        name="question"
                        onChange={handleChange}
                        multiline
                    />
                    </Grid>
                    <Grid item xs={12} md={4}>
                    <FormControl variant="outlined" className={[classes.formControl, classes.questionTypeSelector].join(" ")}>
                        <InputLabel id="answerType-label">Question Type</InputLabel>
                        <ThemeProvider theme={selectButtonTheme}>
                            <Select
                            labelId="answerType-label"
                            id="answerType"
                            // fullWidth
                            value={question.optionType}
                            name="optionType"
                            onChange={handleChange}
                            // className={classes.selectEmpty}
                            label="Answer Type"
                            >
                                <MenuItem value={"comment"}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <ShortTextIcon />
                                        </ListItemAvatar>
                                        <ListItemText  primary={`Short Answer`} />
                                    </ListItem>
                                </MenuItem>
                                <MenuItem value={"radiobutton"}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <RadioButtonCheckedIcon />
                                        </ListItemAvatar>
                                        <ListItemText  primary={`Multiple choice`} />
                                    </ListItem>
                                </MenuItem>
                                <MenuItem value={"checkbox"}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <CheckBoxIcon />
                                        </ListItemAvatar>
                                        <ListItemText  primary={`Checkboxes`} />
                                    </ListItem>
                                </MenuItem>
                            </Select>
                        </ThemeProvider>
                    </FormControl>
                    </Grid>
                </Grid>

    { question.optionType==="radiobutton" && <Grid container justify="flex-start">
                    <FormControl component="fieldset" className={[classes.formControl].join(" ")}>
                        <RadioGroup aria-label="Option Type Multiple Choice selected" name="answerType-radio"  onChange={(e) => console.log(e.target) }/*value={value} onChange={handleChange}*/>
                            <Grid container spacing={1} direction= "column" alignItems="flex-start">
                                { question.options.map((option, index) => {
                                    return  <Grid item key={index}>
                                                <FormControlLabel value={(option === "add**option") ? "Add option": `Option ${index}`} control={<Radio checked={false} />} />
                                                <TextField variant="standard" value={(question['options'][index] !== "add**option") ? (question['options'][index]) : `Option ${index+1}`}  onChange={(e) => {
                                                    // var val = e.target.value
                                                    var tempOptions = question['options']
                                                    tempOptions[index] = e.target.value
                                                    setQuestion({
                                                        ...question,
                                                        options: tempOptions
                                                    })
                                                }} />
                                                <IconButton color="secondary" aria-label="delete this option" onClick={() =>{
                                                        var tempOptions = question['options']
                                                        tempOptions = tempOptions.filter((val,i) => (index != i))
                                                        console.log(tempOptions)
                                                            setQuestion({
                                                                ...question,
                                                                options: tempOptions
                                                            })
                                                            // setQuestion(tempQuestion);
                                                        }} >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                })}
                                <Grid item>
                                    <Button onClick={() =>{
                                        console.log("clicked add option")
                                        setQuestion({
                                            ...question,
                                            options: [...question.options,"add**option"]
                                        })
                                        // setQuestion(tempQuestion);
                                    }} >Add Option</Button>
                                </Grid>
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                </Grid>}

    { question.optionType==="checkbox" && <Grid container justify="flex-start">
                    <FormGroup className={[classes.formControl].join(" ")}>
                        <Grid container spacing={1} direction= "column" alignItems="flex-start">
                            { question.options.map((option, index) => {
                                    return  <Grid item key={index}>
                                                <FormControlLabel  value={(option === "add**option") ? "Add option": `Option ${index}`} control={<Checkbox checked={false} />} />
                                                    <TextField variant="standard" defaultValue={`Option ${index+1}`}  onChange={(e) => {
                                                        // var val = e.target.value
                                                        var tempOptions = question['options']
                                                        tempOptions[index] = e.target.value
                                                        setQuestion({
                                                            ...question,
                                                            options: tempOptions
                                                        })
                                                }} />
                                                <IconButton color="secondary" aria-label="delete this option" onClick={() =>{
                                                        var tempOptions = question['options']
                                                        tempOptions = tempOptions.filter((val,i) => (index !==i))
                                                        console.log(tempOptions)
                                                            setQuestion({
                                                                ...question,
                                                                options: tempOptions
                                                            })
                                                            // setQuestion(tempQuestion);
                                                        }} >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                })}
                                <Grid item>
                                    <Button onClick={() =>{
                                        console.log("clicked add option")
                                        setQuestion({
                                            ...question,
                                            options: [...question.options,"add**option"]
                                        })
                                        // setQuestion(tempQuestion);
                                    }} >Add Option</Button>
                                </Grid>
                        </Grid>
                    </FormGroup>
                </Grid>}

    { question.optionType==="comment" && <Grid container justify="flex-start">
                    <TextField
                        // id="question-text"
                        // label="Question"
                        placeholder="Short Answer"
                        fullWidth
                        variant="standard"
                        className={[classes.formControl, classes.questionField].join(" ")}
                        // value={value}
                        // onChange={handleChange}
                        multiline
                    />
                </Grid>}
            </Grid>
        </Paper>
    )
}

export default CreateQuestion


{/*  */}
// defaultValue={`Option ${index+1}`} 
// onChange={(e) => {
    // var val = e.target.value
    // var tempQuestion = question;
    // console.log(e.target.value, tempQuestion["options"].indexOf("add**option") === -1, question.options)
    // tempQuestion["options"][index] = val
    // if(tempQuestion["options"].indexOf("add**option") === -1){
    //     tempQuestion["options"].push("add**option")
    // }
    // setQuestion(tempQuestion);
// }} />