const express=require("express");
const router=express.Router();

const FeedbackFormCtrl = require("../controllers/feedbackForm")

router.get('/all', FeedbackFormCtrl.getAllFeedbackForms)
router.post('/id', FeedbackFormCtrl.getSingleFeedbackForm)
router.post('/ids', FeedbackFormCtrl.getFewFeedbackForm)
router.post('/create', FeedbackFormCtrl.createNewFeedbackForm)
router.post('/update/id', FeedbackFormCtrl.updateSingleFeedbackForm)
router.post('/delete/id', FeedbackFormCtrl.deleteMultipleFeedbackForm)


module.exports=router;