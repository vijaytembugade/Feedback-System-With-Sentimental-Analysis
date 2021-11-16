const express=require("express");
const router=express.Router();

const SectionCtrl = require('../controllers/section')

router.get('/all',SectionCtrl.getAllSections )
router.post('/ids', SectionCtrl.getFewSections)
router.post('/create', SectionCtrl.createSection)
router.post('/update/id', SectionCtrl.updateSection)
router.post('/delete/id', SectionCtrl.deleteMultipleSection)

module.exports=router;