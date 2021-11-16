// const Joi = require('Joi')
const Joi = require('@hapi/joi');
// const HttpStatus = require("http-status-codes");
const request = require('request');
const axios = require('axios').default;
const Response = require('../models/Response');
const FeedbackForm = require('../models/Feedback_Form');
// const Question = require('../models/Question');

module.exports = {
	generateReport: async (req, res) => {
		var allResponses = await Response.find({ formId: req.body.formId }).then(
			(responses) => {
				return responses;
			}
		);
		var feedbackForm = await FeedbackForm.find({ _id: req.body.formId })
			.then((feedbackForm) => {
				return feedbackForm[0];
			})
			.catch((err) => res.json());

		//call psychological analysis api
		var psych_data = allResponses.map((data) => {
			return {
				student_id: data.studentId,
				response: data.responses[5].map((e) => e.answer),
			};
		});

		var log_data = {};
		log_data.form_id = req.body.formId
		log_data.all_forms = allResponses.map((response) => {
			var temp = [];
			response.responses
				.filter((r, index) => {
					return index !== 5;
				})
				.forEach((sec) => {
					return sec.forEach((r) => {
						if (typeof r.answer === 'object') {
							temp.push(`${r.answer}`);
						} else {
							temp.push(r.answer);
						}
					});
				});
			return { studentId: response.studentId, feedback: temp };
		});

		let analysis = {};
		analysis.form_id = req.body.formId
		await axios
			.post('https://test-feedback-analysis.herokuapp.com/psycho', psych_data)
			.then(async (res1) => {
				console.log('success');
				psych_result = res1.data;
				analysis.psych_result = res1.data;
				console.log('Total Responses: ', allResponses.length, '\nNo. of TrustedIds: ', psych_result.trusted_id.length, '\nNo. of Non-TrustedIds: ',(allResponses.length - psych_result.trusted_id.length))
				await axios
					.post(
						'https://test-feedback-analysis.herokuapp.com/section-wise',
						log_data
					)
					.then((res2) => {
						analysis.log_result = res2.data;
					})
					.catch((err2) => {
						psych_flag = false;
						console.log('err2');
					});

				await axios
					.post(
						'https://test-feedback-analysis.herokuapp.com/summary',
						log_data
					)
					.then((res3) => {
						analysis.summary = res3.data;
					})
					.catch((err3) => {
						psych_flag = false;
						console.log('err3');
					});
				await axios
					.post(
						'https://test-feedback-analysis.herokuapp.com/suggestions',
						log_data
					)
					.then((res4) => {
						analysis.suggestions = res4.data;
					})
					.catch((err4) => {
						psych_flag = false;
						console.log('err4');
					});

				await axios
					.post('https://test-feedback-analysis.herokuapp.com/create-section1', log_data,)
					.then((res5) => {
						analysis.section1_img = res5.data;
						// return image;
					})
					.catch((err5) => {
						psych_flag = false;
						console.log('err5');
					});
			
				await axios
					.post('https://test-feedback-analysis.herokuapp.com/create-section4', log_data,)
					.then((res6) => {
						analysis.section4_img = res6.data;
						// return image;
					})
					.catch((err6) => {
						psych_flag = false;
						console.log('err6');
					});

				await axios
					.post('https://test-feedback-analysis.herokuapp.com/create-section5', log_data,)
					.then((res7) => {
						analysis.section5_img = res7.data;
						// return image;
					})
					.catch((err7) => {
						psych_flag = false;
						console.log('err7');
					});

					await axios
					.post('https://test-feedback-analysis.herokuapp.com/create-syllabus-completion', log_data,)
					.then((res8) => {
						analysis.syllabus_completed = res8.data;
						// return image;
					})
					.catch((err8) => {
						psych_flag = false;
						console.log('err8');
					});


					await axios
					.post('https://test-feedback-analysis.herokuapp.com/create-understand-subject', log_data,)
					.then((res9) => {
						analysis.subject_understanding = res9.data;
						// return image;
					})
					.catch((err9) => {
						psych_flag = false;
						console.log('err9');
					});


				res.json({ analysis });
			})
			.catch((err1) => {
				psych_flag = false;
				console.log('err1', err1);
			});
	},
};

function _imageEncode(arrayBuffer) {
	let u8 = new Uint8Array(arrayBuffer);
	let b64encoded = btoa(
		[].reduce.call(
			new Uint8Array(arrayBuffer),
			function (p, c) {
				return p + String.fromCharCode(c);
			},
			''
		)
	);
	let mimetype = 'image/jpeg';
	return 'data:' + mimetype + ';base64,' + b64encoded;
}
