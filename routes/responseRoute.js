const express=require("express");
const router=express.Router();

const ResponseCtrl = require("../controllers/response")

router.get('/all', ResponseCtrl.getAllResponses)
router.post('/ids', ResponseCtrl.getFewResponse)
router.post('/create', ResponseCtrl.createNewResponse)
router.post('/update/id', ResponseCtrl.updateSingleFeedbackForm)
router.post('/delete/id', ResponseCtrl.deleteMultipleFeedbackForm)


module.exports=router;