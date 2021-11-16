import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShortLinkValidation = (props) => {
    const [isValid, setIsValid] = useState(-1);     // -1 => not valid, 0 => loading, 1=> valid


    useEffect(() => {
        setIsValid(0)
        console.log(props.match.params.hashString)
        if(props.match.params.hashString == 'amit'){
            setIsValid(1)
        }
        else {
            setIsValid(-1)
        }
    }, [])

    useEffect(() => {
        if(isValid == -1){
            console.log("not valid")
        }
        else if(isValid == 1){
            console.log("valid")
        }
        else if(isValid == 0){
            console.log("loading")
        }
    }, [isValid])


    const notValid = () => {
        return <h1>Not Valid</h1>
    }
    const valid = () => {
        return <h1>Valid</h1>
    }
    const Loading = () => {
        return <h1>Loading</h1>
    }

    return (
        <div>
            { (isValid == -1) ? notValid() : ((isValid == 0) ? Loading() : (isValid == 1) ? valid() : null) }
        </div>
    )
}

export default ShortLinkValidation
