// const Joi = require('Joi')
const Joi = require('@hapi/joi')
const HttpStatus=require("http-status-codes")

const Response = require("../models/Response")
const StudentAccess = require("../models/StudentAccess")


module.exports={
    getAllResponses:  async (req, res) => {
        await Response.find()
            .then(responses => res.json(responses))
            .catch(err => res.json(err))
    },
    getFewResponse: async (req, res) => {
        await Response.find({_id: req.body.id})
            .then(responses => res.json(responses))
            .catch(err => res.json(err))
    },

    createNewResponse: async (req, res) => {
        const responseSchema = Joi.object().keys({
            formId: Joi.string().required(),
            studentId: Joi.string().required(),
            responses: Joi.array().required(),
        })

        const { error , value } = responseSchema.validate(req.body)//if it has error then value saved is error else if value then saved in value by calling Joi.validate
        if(error && error.details){
            return res.status(HttpStatus.BAD_REQUEST).json({msg:error.details});
        }

        const body={
            formId : value.formId,
            studentId : value.studentId,
            responses : value.responses
        }

        Response.create(body)
            .then(feedbackForm => {
                StudentAccess.findOneAndUpdate({ $and: [ {form_id : body.formId}, {student_id : body.studentId} ] }, { status: 'processing'}, { returnNewDocument : true })
                    .then(res1 => res.json(feedbackForm))
                    .catch(err1 => res.json({message: "response saved, error while updating status", error: err1}))
            })
            .catch(err => res.json(err))
    },

    updateSingleFeedbackForm: async (req, res) => {
        const schema = Joi.object().keys({
            formId: Joi.string().required(),
            studentId: Joi.string().required(),
            responses: Joi.array(),
        })

        const { error , value } = schema.validate(req.body.data)//if it has error then value saved is error else if value then saved in value by calling Joi.validate

        if(error && error.details){
            return res.status(HttpStatus.BAD_REQUEST).json({msg:error.details});
        }
        const body={
            formId : value.formId,
            studentId : value.studentId,
            responses : value.responses
        }

        Response.findOneAndUpdate({ _id: req.body.id }, body , { returnNewDocument : true })
            .then(feedbackForm => res.json(feedbackForm))
            .catch(err => res.json(err))
            
    },

    deleteMultipleFeedbackForm: async ( req, res ) => {
        Response
            .deleteMany({ _id: { $in: req.body.id } })
            .then(data => res.json(data))
            .catch(err => res.json(err))
    }
}