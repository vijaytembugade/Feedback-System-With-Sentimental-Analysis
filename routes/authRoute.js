const express=require("express");
const router=express.Router();
 
const AuthCtrl=require("../controllers/authController");

router.post("/admin/register",AuthCtrl.CreateAdmin);
router.post("/admin/login",AuthCtrl.LoginAdmin);
router.post('/student/register', AuthCtrl.RegisterStudent);
router.post('/student/login', AuthCtrl.LoginStudent);
module.exports=router;
