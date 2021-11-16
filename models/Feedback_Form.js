const mongoose=require("mongoose");

const feedbackFormSchema=mongoose.Schema({
    form_name:{
        type: String,
        required: true
    },
    teacher_details:{
        teacher_id: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        }
    },
    selected_students:{
        type: Array,
        required: true
    },
    sections: {
        type : Array,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }, 
})

module.exports=mongoose.model("feedback_form",feedbackFormSchema)


