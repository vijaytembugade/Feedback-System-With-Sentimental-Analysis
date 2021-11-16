// const Joi = require('Joi')
const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');
const User = require('../models/admin');
const StudentAccess = require('../models/StudentAccess');
// const Helpers=require("../../Helpers/helpers")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');
// const { roles } = require("../../Helpers/roles");
const Student = require('../models/Student');
var nodemailer = require('nodemailer');
var generator = require('generate-password');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'amitnemade3@gmail.com',
		pass: 'Amit@341999',
	},
});

module.exports = {
	async CreateAdmin(req, res) {
		const schema = Joi.object().keys({
			fname: Joi.string().required(),
			mname: Joi.string().required(),
			lname: Joi.string().required(),
			phone: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
			role: Joi.string().default('admin'),
		});

		const { error, value } = schema.validate(req.body); //if it has error then value saved is error else if value then saved in value by calling Joi.validate

		if (error && error.details) {
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'Either Email or password are not valid' });
		}

		const userEmail = await User.findOne({
			email: req.body.email.toLowerCase(),
		}); //to check if the email already exist
		if (userEmail) {
			return res
				.status(HttpStatus.CONFLICT)
				.json({ message: 'Email already exist' });
		}

		const userPhone = await User.findOne({
			phone: req.body.phone.toLowerCase(),
		}); //to check if the phone number already exist

		if (userPhone) {
			return res
				.status(HttpStatus.CONFLICT)
				.json({ message: 'Phone number already exist' });
		}

		return bcrypt.hash(value.password, 10, (err, hash) => {
			if (err) {
				return res
					.status(HttpStatus.BAD_REQUEST)
					.json({ message: 'Error hashing password' });
			}

			const body = {
				fname: value.fname,
				mname: value.mname,
				lname: value.lname,
				phone: value.phone,
				email: value.email.toLowerCase(),
				password: hash,
				role: value.role.toLowerCase(),
			};

			User.create(body)
				.then((user) => {
					const token = jwt.sign({ data: user }, dbConfig.secret, {
						expiresIn: '5h',
					});
					res.cookie('auth', token);
					res
						.status(HttpStatus.CREATED)
						.json({ message: 'User created successfully', user, token });
				})
				.catch((err) => {
					res
						.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.json({ message: 'Error occured' + err });
				});
		});
	},

	async LoginAdmin(req, res) {
		if (!req.body.email || !req.body.password) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ message: 'No empty fields allowed' });
		}

		await User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					return res
						.status(HttpStatus.NOT_FOUND)
						.json({ message: 'E-mail not found' });
				}

				return bcrypt
					.compare(req.body.password, user.password)
					.then((result) => {
						if (!result) {
							return res
								.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.json({ message: 'Password is incorrect' });
						}
						// dbConfig.secret
						const token = jwt.sign({ data: user }, process.env.TOKEN_SECRET, {
							expiresIn: '5h',
						});
						res.cookie('token', token);
						return res
							.status(HttpStatus.OK)
							.json({ message: 'Login successful', user, token });
					});
			})
			.catch((err) => {
				return res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ message: 'Error occured' + err });
			});
	},

	async RegisterStudent(req, res) {
		const schema = Joi.object().keys({
			student_id: Joi.array().required(),
			form_id: Joi.string().required(),
			role: Joi.string().default('student'),
		});

		const { error, value } = schema.validate(req.body); //if it has error then value saved is error else if value then saved in value by calling Joi.validate

		if (error && error.details) {
			return res
				.status(HttpStatus.BAD_REQUEST)
				.json({ message: 'Either of the field(s) are not valid' });
		}

		// const userEmail=await StudentAccess.findOne({
		// 	email: req.body.email.toLowerCase()
		// });//to check if the email already exist
		// if(userEmail){
		// 	return res.status(HttpStatus.CONFLICT).json({message:"Email already exist"})
		// }

		var flag = value.student_id.map(async (s_id, index) => {
			var temp = [];
			console.log(index);
			var password = generator.generate({
				length: 10,
				numbers: true,
			});
			await Student.findById(s_id)
				.then((student) => {
					bcrypt.hash(password, 10, (err, hash) => {
						if (err) {
							temp.push({
								status: HttpStatus.BAD_REQUEST,
								...{ message: 'Error hashing password', err },
							});
						}
						bcrypt.hash(
							`${{ student_id: s_id, form_id: value.form_id }}`,
							10,
							async (err1, hash1) => {
								if (err1) {
									temp.push({
										status: HttpStatus.BAD_REQUEST,
										...{ message: 'Error hashing details', err1 },
									});
								}

								const body = {
									hash_string: hash1,
									student_id: s_id,
									form_id: value.form_id,
									password: hash,
									role: value.role,
								};
								var mailId = student.email;

								console.log(mailId);

								var id = '';
								var link =
									'https://test-feedback-sys.herokuapp.com/short/' +
									encodeURIComponent(body.hash_string);

								var mailOptions = {
									from: 'amitnemade3@gmail.com',
									to: mailId,
									subject:
										'Very Very Urgent!!!!. Please fill the feedback form',
									html:
										'We are taking for the feedback for our project.<br>' +
										'So, We request you to do so.<br>' +
										'This is auto-generated mail, having a link and password attached to it. Kindly click on the link and give feedback <br>' +
										'<br>' +
										'<br>' +
										'Details for the feedback form are given below <br>' +
										'<b>Subject:</b> SPA / Programming language C.<br>' +
										'<b>Subject Teacher:</b> Dalgade sir.<br>' +
										"<b>Link:</b> <a href='" +
										link +
										"' ><em>Click here</em> </a><br>" +
										'<b>password:</b> <em>' +
										password +
										'</em></p>' +
										'<br>' +
										'<br>' +
										'Regards.<br>' +
										'Vijay Tembugade<br>',
								};
								let info = await transporter.sendMail(
									mailOptions
									// 	, function (error, info) {
									// 	if (error) {
									// 		temp.push(error);
									// 	} else {
									// 		temp.push(info.response);
									// 		console.log('Owner Email sent: ' + info.response);
									// 	}
									// }
								);
								console.log('Owner Email sent: ' + info.response);
								await StudentAccess.create(body)
									.then((student) => {
										temp.push({
											status: HttpStatus.CREATED,
											...{ message: 'User created successfully', student },
										});
									})
									.catch((err) => {
										temp.push({
											status: HttpStatus.INTERNAL_SERVER_ERROR,
											...{ message: 'Error occured' + err },
										});
									});
							}
						);
					});
				})
				.catch((err) => temp.push({ status: HttpStatus.CONFLICT, err }));
			return temp;
		});
		res.status(200).json(flag);
	},

	async LoginStudent(req, res) {
		if (!req.body.password || !req.body.hash_string) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ message: 'No empty fields allowed' });
		}

		await StudentAccess.findOne({
			hash_string: decodeURIComponent(req.body.hash_string),
		})
			.then((student) => {
				if (!student) {
					return res
						.status(HttpStatus.NOT_FOUND)
						.json({ message: 'Student not found' });
				}

				return bcrypt
					.compare(req.body.password, student.password)
					.then((result) => {
						if (!result) {
							return res
								.status(HttpStatus.UNAUTHORIZED)
								.json({ message: 'Password is incorrect' });
						}
						// dbConfig.secret
						const token = jwt.sign(
							{ data: student },
							process.env.TOKEN_SECRET,
							{
								expiresIn: '5h',
							}
						);
						res.cookie('token', token);
						return res
							.status(HttpStatus.OK)
							.json({ message: 'Login successful', student, token });
					});
			})
			.catch((err) => {
				return res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ message: 'Error occured' + err });
			});
	},

	grantAccess(action, resource) {
		return async (req, res, next) => {
			try {
				// dbConfig.secret
				const verified = jwt.verify(req.cookies.auth, process.env.TOKEN_SECRET);
				const permission = roles.can(verified.data.role)[action](resource);
				if (!permission.granted) {
					return res.status(401).json({
						error: "You don't have enough permission to perform this action",
					});
				}
				next();
			} catch (error) {
				next(error);
			}
		};
	},

	async allowIfLoggedIn(req, res, next) {
		try {
			if (!req.cookies.auth) {
				return res.status(401).json({
					error: 'You need to be logged in to access this route',
				});
			}
			// dbConfig.secret
			const verified = jwt.verify(req.cookies.auth, process.env.TOKEN_SECRET);
			if (!verified) {
				return res.status(401).json({
					error:
						'Your session seems to be expired. You need to be logged in again to access this route.',
				});
			}
			next();
		} catch (error) {
			next(error);
		}
	},
};
