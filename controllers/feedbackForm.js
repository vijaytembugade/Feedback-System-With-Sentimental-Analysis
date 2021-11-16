// const Joi = require('Joi')
const Joi = require("@hapi/joi");
const HttpStatus = require("http-status-codes");

const FeedbackForm = require("../models/Feedback_Form");
const Section = require("../models/Sections");
const Question = require("../models/Question");

module.exports = {
	getAllFeedbackForms: async (req, res) => {
		await FeedbackForm.find()
			.then((feedbackform) => {
				res.json(feedbackform);
			})
			.catch((err) => res.json(err));
	},
	getSingleFeedbackForm: async (req, res) => {
		var form = {};
		form.details = await FeedbackForm.find({ _id: req.body.id })
			.then((feedbackForm) => {
				return feedbackForm[0];
			})
			.catch((err) => res.json());
		var sections = await Promise.all(
			form.details.sections.map(async (sectionId) => {
				var tempSection = await Section.find({ _id: sectionId })
					.then((section) => {
						return { section_id: sectionId, name: section[0].name, qId: section[0].questionIds };
					})
					.catch((err) => res.json());
				tempSection.questions = await Question.find({
					_id: { $in: tempSection.qId },
				})
					.then((questions) => {
						return questions;
					})
					.catch((err) => res.json(err));
				delete tempSection["qId"];
				return tempSection;
			})
		);
		form.sections = sections;
		res.json(form);
	},
	getFewFeedbackForm: async (req, res) => {
		await FeedbackForm.find({ _id: { $in: req.body.ids } })
			.then((feedbackform) => res.json(feedbackform))
			.catch((err) => res.json(err));
	},

	createNewFeedbackForm: async (req, res) => {
		const schema = Joi.object().keys({
			form_name: Joi.string().required(),
			sections: Joi.array().required(),
			teacher_details: Joi.object().keys({
				teacher_id: Joi.string().required(),
				subject: Joi.string().required(),
			}),
			selected_students: Joi.array().required(),
		});

		const { error, value } = schema.validate(req.body); //if it has error then value saved is error else if value then saved in value by calling Joi.validate

		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
		}

		const body = {
			form_name: value.form_name,
			teacher_details: value.teacher_details,
			sections: value.sections,
			selected_students: value.selected_students,
		};

		FeedbackForm.create(body)
			.then((feedbackForm) => {
				res.json(feedbackForm);
			})
			.catch((err) => res.json(err));
	},

	updateSingleFeedbackForm: async (req, res) => {
		const schema = Joi.object().keys({
			form_name: Joi.string().required(),
			sections: Joi.array().required(),
			teacher_details: Joi.object().keys({
				teacher_id: Joi.string().required(),
				subject: Joi.string().required(),
			}),
			selected_students: Joi.array().required(),
		});

		const { error, value } = schema.validate(req.body.data); //if it has error then value saved is error else if value then saved in value by calling Joi.validate

		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
		}
		const body = {
			form_name: value.form_name,
			teacher_details: value.teacher_details,
			section: value.sections,
		};

		FeedbackForm.findOneAndUpdate({ _id: req.body.id }, body, {
			returnNewDocument: true,
		})
			.then((feedbackForm) => res.json(feedbackForm))
			.catch((err) => res.json(err));
	},

	deleteMultipleFeedbackForm: async (req, res) => {
		FeedbackForm.deleteMany({ _id: { $in: req.body.id } })
			.then((data) => res.json(data))
			.catch((err) => res.json(err));
	},
};
