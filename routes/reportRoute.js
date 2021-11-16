const express=require("express");
const router=express.Router();

const ReportCtrl = require("../controllers/reportController")

// router.get('/all', ResponseCtrl.getAllResponses)
router.post('/generate', ReportCtrl.generateReport)
// router.post('/create', ResponseCtrl.createNewResponse)
// router.post('/update/id', ResponseCtrl.updateSingleFeedbackForm)
// router.post('/delete/id', ResponseCtrl.deleteMultipleFeedbackForm)


module.exports=router;