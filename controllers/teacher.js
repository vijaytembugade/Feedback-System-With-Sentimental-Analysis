// const Joi = require('Joi')
const Joi = require('@hapi/joi')
const HttpStatus=require("http-status-codes")

const Teacher = require("../models/Teacher")

module.exports = {
  getAllTeachers: async (req, res) => {
    await Teacher.find()
      .then((teachers) => res.json(teachers))
      .catch((err) => res.json(err));
  },
  getFewTeacher: async (req, res) => {
    await Teacher.find({ _id: { $in: req.body.ids } })
      .then((responses) => res.json(responses))
      .catch((err) => res.json(err));
  },

  createNewTeacher: async (req, res) => {
    const schema = Joi.object().keys({
      designation: Joi.string().required(),
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      email: Joi.string().required(),
      mobile: Joi.string().min(10).max(10).required(),
      subjects: Joi.array().required(),
    });

    const { error, value } = schema.validate(req.body); //if it has error then value saved is error else if value then saved in value by calling Joi.validate

    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }

    const teacherEmail = await Teacher.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (teacherEmail) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Teacher with same Email already exist" });
    }

    const teacherMobile = await Teacher.findOne({
      mobile: req.body.mobile,
    });
    if (teacherMobile) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Teacher with same Mobile number already exist" });
    }

    const body = {
      designation: value.designation,
      fname: value.fname,
      lname: value.lname,
      email: value.email,
      mobile: value.mobile,
      subjects: value.subjects,
    };

    Teacher.create(body)
      .then((teacher) => res.json(teacher))
      .catch((err) => res.json(err));
  },

  updateSingleTeacher: async (req, res) => {
    console.log("reached update")
    const schema = Joi.object().keys({
      designation: Joi.string().required(),
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      email: Joi.string().required(),
      mobile: Joi.string().min(10).max(10).required(),
      subjects: Joi.array().required(),
    });

    const { error, value } = schema.validate(req.body.data); //if it has error then value saved is error else if value then saved in value by calling Joi.validate

    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }

    const body = {
      designation: value.designation,
      fname: value.fname,
      lname: value.lname,
      email: value.email,
      mobile: value.mobile,
      subjects: value.subjects,
    };

    Teacher.findOneAndUpdate({ _id: req.body.id }, body, {
      returnNewDocument: true,
    })
      .then((teacher) => res.json(teacher))
      .catch((err) => res.json(err));
  },

  deleteMultipleTeacher: async (req, res) => {
    Teacher.deleteMany({ _id: { $in: req.body.id } })
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  },
};