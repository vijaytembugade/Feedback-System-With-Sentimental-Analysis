import { Button, Container, Grid, makeStyles, Paper, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import CreateQuestion from './CreateQuestion'
var randomColor = require('randomcolor');

const styles = makeStyles(theme => ({
    tempBorder: {
        border: '2px solid black'
    },
    section: {
        margin: theme.spacing(2),
    },
    sectionPaper: {
        padding: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
    },
}));


const CreateSection = (props) => {
    const classes = styles();
    const bgColor = randomColor({
        luminosity: 'light',
        format: 'rgba'
    });
    const [section, setSection] = useState({ name: "", questions: [], color: bgColor});

    useEffect(() =>{
        console.log("reached section useEffect")
        props.handleSection(props.index, section)
    },[section])

    const handleQuestion = (index, question) => {
        console.log("reached handleQuestion")
        var tempQuestion = section.questions;
        tempQuestion[index] = question
        setSection({
            ...section,
            questions: tempQuestion
        })
    }
    
    
    return (
        <Paper variant="outlined" elevation={0} style={{backgroundColor: `${"#f1f1f1"}`}} className={classes.sectionPaper}>
            <Container>
                <Grid container spacing={2} direction="column" >
                    <Grid item style={{marginTop:"-50px", marginRight: "auto"}}>
                    <TextField
                        id="section-name"
                        label="Name of Section"
                        placeholder="Placeholder"
                        style={{marginLeft:"0px"}}
                        variant="filled"
                        className={[classes.formControl, classes.questionField].join(" ")}
                        // value={section.name}
                        name="name"
                        onChange={(e) => setSection({
                            ...section, name: e.target.value
                        })}
                        multiline
                    />
                    </Grid>
                    {/* <Grid item >
                        <CreateQuestion />
                    </Grid> */}
                    {/* {section.questions.length} */}
                    {
                        section.questions.map((set, index) => {
                            return <Grid item key={index}>
                                        <CreateQuestion handleQuestion={handleQuestion} section={section} index={index} />
                                    </Grid>
                        })
                    }
                    <Grid item>
                        <Button onClick={() =>{
                            console.log("clicked add question")
                            setSection({
                                ...section,
                                questions: [...section.questions, {}]
                            })
                        }} >Add Question</Button>
                    </Grid>


                </Grid>

            </Container>
        </Paper>
    )
}

export default CreateSection
