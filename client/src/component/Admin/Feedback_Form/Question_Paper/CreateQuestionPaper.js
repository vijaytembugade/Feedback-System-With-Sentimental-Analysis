import { Button, Checkbox, Container, FormControlLabel, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import CreateSection from './CreateSection';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';

const styles = makeStyles(theme => ({
    tempBorder: {
        border: '2px solid black'
    }

}));



const CreateQuestionPaper = () => {
    const classes = styles();

    const [questionSet, setQuestionSet] = useState([])
    // [
    //     {
    //         name: "Name of Section",
    //         question: [
    //             {
    //                 question: "",
    //                 optionType: "",
    //                 options: [],
    //                 commment: "", 
    //             } // question
    //         ]

    //     } //Section
    // ]

    useEffect(()=> {
        console.log(questionSet)
    },[questionSet])

    const handleSection = (index, section) => {
        console.log("reached handleSection",index)
        var tempSections = questionSet;
        tempSections[index] = section
        console.log(section, tempSections)
        setQuestionSet(tempSections)
    }

    return (
        <div>
            <Container>
                <Grid container spacing={2} direction="column" >
                    {/* {console.log(questionSet)} */}
                    {
                        // questionSet.length
                        questionSet.map((set, index) => {
                            return <Grid item key={index} style={{marginTop: "50px"}}>
                                        <CreateSection handleSection={handleSection} questionSet={questionSet} index={index} />
                                    </Grid>
                        })
                    }
                    <Grid item>
                        <Button onClick={() =>{
                            console.log("clicked add Section", [...questionSet, {}])
                            setQuestionSet([...questionSet, {}])
                        }} ><AddIcon />Add Section</Button>
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            value="end"
                            control={<Checkbox color="primary" />}
                            label={<Typography >Add default <strong> Sentimental Analysis model </strong> at the end of feedback form</Typography>}
                            labelPlacement="end"
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="primary" onClick={() =>{
                           console.log(questionSet)
                        }} >Save Feedback Form <SaveIcon style={{paddingLeft: "5px"}} /></Button>
                    </Grid>

                </Grid>


            </Container>
        </div>
    )
}

export default CreateQuestionPaper
