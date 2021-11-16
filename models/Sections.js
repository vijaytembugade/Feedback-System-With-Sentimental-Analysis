const mongoose=require("mongoose");

const sectionsSchema=mongoose.Schema({
        name:{
            type: String,
            required: true
        },
        questionIds:{
            type: Array,
            required: true
        }
    });

module.exports=mongoose.model("section",sectionsSchema)