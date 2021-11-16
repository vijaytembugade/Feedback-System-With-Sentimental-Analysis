const mongoose=require("mongoose");
const bcrypt=require("bcryptjs")

const adminSchema=mongoose.Schema({
    fname: {type:String},
    mname: {type:String},
    lname: {type:String},
    email:{type:String},
    phone: {type:String},
    password:{type:String},
    role:{
        type:String,
        default: "admin"
    },
})

adminSchema.statics.EncryptPassword=async function(password){
  const hash =await bcrypt.hash(password,10);
  return hash;
}

module.exports=mongoose.model("admin", adminSchema)

