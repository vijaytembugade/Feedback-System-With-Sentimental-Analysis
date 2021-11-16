const mongoose=require("mongoose");


const responseSchema=mongoose.Schema({
    formId:{
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    responses: {
        type: Object,
        required: true
    },
    // responses: [
    //     {
    //         question_id :{
    //             type: String,
    //             required: true
    //         },
    //         answer:{
    //             type: mongoose.Schema.Types.Mixed,
    //             required: true
    //         }
    //     }
    // ],
    timestamp: {
        type: Date,
        default: Date.now()
    }, 
})


module.exports=mongoose.model("response",responseSchema)

