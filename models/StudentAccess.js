const mongoose=require("mongoose");
const bcrypt=require("bcryptjs")

const studentAccessSchema=mongoose.Schema({
    hash_string: {type: String},
    student_id: {type:String},
    form_id: {type:String},
    password: {type:String},
    status: {type:String, default: "pending"},
    role:{
        type:String,
        default: "student"
    },
    timeStamp: {
        type: Date,
    },
})

studentAccessSchema.statics.EncryptPassword=async function(password){
  const hash =await bcrypt.hash(password,10);
  return hash;
}

module.exports=mongoose.model("studentAccess", studentAccessSchema)

