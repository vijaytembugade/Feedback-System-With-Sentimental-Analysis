const mongoose=require("mongoose");

const teacherSchema=mongoose.Schema({
    designation:{
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true 
    },
    mobile: {
        type: String,
        required: true 
    },
    subjects: {
        type: Array,
        required: true 
    },
    ratings: {
        type: Number,
        default: -1
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }, 
})


module.exports=mongoose.model("teacher",teacherSchema)

