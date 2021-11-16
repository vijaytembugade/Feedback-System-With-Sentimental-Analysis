const express=require("express");
const router=express.Router();

const StudentCtrl = require("../controllers/student")

router.get('/all', StudentCtrl.getAllStudents)
router.post('/ids', StudentCtrl.getFewStudents)
router.post('/create', StudentCtrl.createNewStudent)
router.post('/update/id', StudentCtrl.updateSingleStudent)
router.post('/delete/id', StudentCtrl.deleteMultipleStudent)

module.exports=router;