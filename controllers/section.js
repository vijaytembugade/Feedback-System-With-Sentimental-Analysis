// const Joi = require('Joi')
const Joi = require('@hapi/joi')
const HttpStatus = require("http-status-codes");
const Section = require('../models/Sections');

module.exports = {
    getAllSections :async (req, res)=>{
        await Section.find()
            .then(sections => res.json(sections))
            .catch(err => res.json(err))
    },
    getFewSections :async (req, res)=>{
        await Section.find({ _id: { $in: req.body.ids } })
          .then((sections) => res.json(sections))
          .catch((err) => res.json(err));
    },

    createSection : async(req,res) =>{
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            questionIds: Joi.array().required(),
        })
        const {error, value}  = schema.validate(req.body); 
        if(error){
            return res.status(HttpStatus.BAD_REQUEST).json({msg:error.details});
        }

        const body ={
            name: value.name,
            questionIds: value.questionIds,
        }

        await Section.create(body)
          .then((section) => res.json(section))
          .catch((err) => res.json(err))
    },

    updateSection : async (req,res) =>{
        const schema = Joi.object().keys({
          name: Joi.string(),
          questionIds: Joi.array(),
        });

        const { error, value } = schema.validate(req.body.data);
        if (error) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ msg: error.details });
        }

        const body = {
          name: value.name,
          questionIds: value.questionIds,
        }

        Section.findOneAndUpdate({_id: req.body.id}, body,{returnNewDocument: true})
            .then(section => res.json(section))
            .catch(err => res.json(err))
    },

    deleteMultipleSection : async (req,res) =>{
        Section.deleteMany({_id: {$in : req.body.ids}})
        .then(data => res.json(data))
        .catch(err => res.json(err))
    } 

}