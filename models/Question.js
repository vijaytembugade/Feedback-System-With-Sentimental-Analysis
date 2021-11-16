const mongoose=require("mongoose");

const questionSchema=mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    questiontype: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        default: [],
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }, 
})


module.exports=mongoose.model("question",questionSchema)

