// const Joi = require('Joi')
const Joi = require('@hapi/joi')
const HttpStatus = require("http-status-codes");
const Question = require('../models/Question');

module.exports = {
    getAllQuestions :async (req, res)=>{
        await Question.find()
            .then(question => res.json(question))
            .catch(err => res.json(err))
    },
    getFewQuestions :async (req, res)=>{
        await Question.find({ _id: { $in: req.body.ids } })
          .then((question) => res.json(question))
          .catch((err) => res.json(err));
    },

    createQuestion : async(req,res) =>{
        const schema = Joi.object().keys({
            question: Joi.string().required(),
            questiontype: Joi.string().required(),
            options: Joi.array().default([])
        })
        const {error, value}  = schema.validate(req.body); 
        if(error){
            return res.status(HttpStatus.BAD_REQUEST).json({msg:error.details});
        }

        const body ={
            question : value.question,
            questiontype: value.questiontype,
            options : value.options,
        }

        await Question.create(body)
          .then((question) => res.json(question))
          .catch((err) => res.json(err))
    },

    updateQuestion : async (req,res) =>{
        const schema = Joi.object().keys({
          question: Joi.string(),
          questiontype: Joi.string(),
          options: Joi.array(),
        });

        const { error, value } = schema.validate(req.body.data);
        if (error) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ msg: error.details });
        }

        const body = {
          question: value.question,
          questiontype: value.questiontype,
          opyions: value.options,
        }

        Question.findOneAndUpdate({_id: req.body.id}, body,{returnNewDocument: true})
            .then(question => res.json(question))
            .catch(err => res.json(err))
    },

    deleteMultipleQuestion : async (req,res) =>{
        Question.deleteMany({_id: {$in : req.body.ids}})
        .then(data => res.json(data))
        .catch(err => res.json(err))
    } 

}