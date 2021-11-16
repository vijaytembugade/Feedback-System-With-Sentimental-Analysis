const express=require("express");
const router=express.Router();

const TeacherCtrl = require('../controllers/teacher')

router.get('/all', TeacherCtrl.getAllTeachers)
router.post('/ids', TeacherCtrl.getFewTeacher)
router.post('/create', TeacherCtrl.createNewTeacher)
router.post('/update/id', TeacherCtrl.updateSingleTeacher)
router.post('/delete/id', TeacherCtrl.deleteMultipleTeacher)

module.exports=router;