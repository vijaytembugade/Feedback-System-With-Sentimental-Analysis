const mongoose=require("mongoose");

const studentSchema=mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true 
    },
    division: {
        type: String,
        required: true 
    },
    rollno: {
        type: Number,
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
    yearofstudy: {
        type: String,
        required: true 
    },
    department: {
        type: String,
        required: true 
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
})


module.exports=mongoose.model("student",studentSchema)

