const express=require("express");
const router=express.Router();

const QuestionCtrl = require('../controllers/question')

router.get('/all',QuestionCtrl.getAllQuestions )
router.post('/ids', QuestionCtrl.getFewQuestions)
router.post('/create', QuestionCtrl.createQuestion)
router.post('/update/id', QuestionCtrl.updateQuestion)
router.post('/delete/id', QuestionCtrl.deleteMultipleQuestion)

module.exports=router;