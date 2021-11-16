// const Joi = require('Joi')
const Joi = require('@hapi/joi')
const HttpStatus=require("http-status-codes")

const Student = require("../models/Student")
// This is Amit
//This is Vijay
module.exports = {
  getAllStudents: async (req, res) => {
    await Student.find()
      .then((students) => res.json(students))
      .catch((err) => res.json(err));
  },
  getFewStudents: async (req, res) => {
    await Student.find({ _id: { $in: req.body.ids } })
      .then((responses) => res.json(responses))
      .catch((err) => res.json(err));
  },

  createNewStudent: async (req, res) => {
    const schema = Joi.object().keys({
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      division: Joi.string().required(),
      rollno: Joi.number().required(),
      email: Joi.string().required(),
      mobile: Joi.string().min(10).max(10).required(),
      yearofstudy: Joi.string().required(),
      department: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body); //if it has error then value saved is error else if value then saved in value by calling Joi.validate

    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }

    const studentEmail = await Student.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (studentEmail) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Student with same Email already exist" });
    }

    const studentMobile = await Student.findOne({
      email: req.body.mobile,
    });
    if (studentMobile) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Student with same Mobile number already exist" });
    }

    const body = {
      fname: value.fname,
      lname: value.lname,
      division: value.division,
      rollno: value.rollno,
      email: value.email,
      mobile: value.mobile,
      yearofstudy: value.yearofstudy,
      department: value.department,
    };

    Student.create(body)
      .then((student) => res.json(student))
      .catch((err) => res.json(err));
  },

  updateSingleStudent: async (req, res) => {
    const schema = Joi.object().keys({
      fname: Joi.string(),
      lname: Joi.string(),
      division: Joi.string(),
      rollno: Joi.number(),
      email: Joi.string(),
      mobile: Joi.string().min(10).max(10),
      yearofstudy: Joi.string(),
      department: Joi.string(),
    });

    const { error, value } = schema.validate(req.body.data); //if it has error then value saved is error else if value then saved in value by calling Joi.validate

    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }
    const body = {
      fname: value.fname,
      lname: value.lname,
      division: value.division,
      rollno: value.rollno,
      email: value.email,
      mobile: value.mobile,
      yearofstudy: value.yearofstudy,
      department: value.department,
    };

    Student.findOneAndUpdate({ _id: req.body.id }, body, {
      returnNewDocument: true,
    })
      .then((student) => res.json(student))
      .catch((err) => res.json(err));
  },

  deleteMultipleStudent: async (req, res) => {
    Student.deleteMany({ _id: { $in: req.body.id } })
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  },
};