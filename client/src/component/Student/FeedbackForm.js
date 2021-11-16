import {
	Button,
	Checkbox,
	FormControlLabel,
	Grid,
	IconButton,
	TextField,
	Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
// import { getFeedbackForm } from '../../actions/studentActions';
import axios from 'axios';
import Boy_1 from './Emoji/Boy_1';
import Boy_2 from './Emoji/Boy_2';
import Boy_3 from './Emoji/Boy_3';
import Boy_4 from './Emoji/Boy_4';
import Boy_5 from './Emoji/Boy_5';
import Girl_1 from './Emoji/Girl_1';
import Girl_2 from './Emoji/Girl_2';
import Girl_3 from './Emoji/Girl_3';
import Girl_4 from './Emoji/Girl_4';
import Girl_5 from './Emoji/Girl_5';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

const styles = makeStyles((theme) => ({
	section: {
		margin: theme.spacing(2),
	},
	outerDiv1: {
		backgroundColor: '#ffffff',
		height: '34vh',
	},
	outerDiv2: {
		backgroundColor: '#0A66C2',
		height: '66vh',
	},
	innerDiv1: {
		backgroundColor: '#0A66C2',
		height: '66vh',
		maxWidth: '700px',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	innerDiv2: {
		backgroundColor: '#ffffff',
		height: '34vh',
		maxWidth: '700px',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	tempBorder: {
		border: '2px solid black',
	},
}));

function FeedbackForm() {
	const classes = styles();
	const [feedback_form, setFeedbackForm] = useState(undefined);
	const [currentSection, setCurrentSection] = useState(0);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answer, setAnswer] = useState([]);
	const [gender, setGender] = useState('male');
	const [currentRadio, setCurrentRadio] = useState(-1);
	const [currentAnswer, setCurrentAnswer] = useState(-1);
	const [error, setError] = useState('');
	const location = useLocation();
	const history = useHistory();
	const dispatch = useDispatch();
	const authDetails = useSelector((state) => state.auth);
	const [prevClicked, setPrevClicked] = useState(false);
	const [showPsychoPopup, setShowPsychoPopup] = useState(false);

	useEffect(() => {
		if (
			(!authDetails.isAuthenticated &&
				authDetails.user.data.role !== 'student') ||
			location.state == undefined
		)
			history.push('/student/error', {
				details: {
					error_code: '401',
					error_desc: 'Forbidden Access',
					error_message:
						'Click the link you got in the mail and login again. \nSorry for the inconvenience caused to you.',
				},
			});
	});

	useEffect(() => {
		// getFeedbackForm();
		if (location.state) {
			axios
				.post('/api/feedbackforms/id', { id: authDetails.user.data.form_id })
				.then((res) => {
					console.log(res.data);
					// var temp = res.data
					// temp = {
					// 	...res.data,
					// 	sections: res.data.sections.filter(section => section.section_id === "5fbffb5245dfde2994e2e4b3")
					// }
					setFeedbackForm(res.data);
					setCurrentSection(0);
					setCurrentQuestion(0);
				})
				.catch((err) => {
					console.log(
						'error in fetching feedback form with form id ' +
							location.state.details.student.form_id +
							' => ',
						err,
						err.response.data
					);
				});
		}
	}, []);

	useEffect(() => {
		console.log(answer);
	}, [answer]);

	const handleCheckBoxAnswer = (e) => {
		var val = e.target.value;
		var checked = e.target.checked;

		if (checked) {
			if (currentAnswer == -1) {
				setCurrentAnswer([val]);
			} else {
				var tempAns = currentAnswer;
				if (tempAns.indexOf(val) == -1) {
					tempAns.push(val);
					setCurrentAnswer(tempAns);
				}
			}
		} else {
			var tempAns = currentAnswer;
			if (tempAns.indexOf(val) > -1) {
				tempAns.splice(tempAns.indexOf(val), 1);
				setCurrentAnswer(tempAns);
			}
		}
	};

	// const handleRadioAnswer = (val)  => {
	// 	setCurrentAnswer(val)

	// }

	const previousQuestion = () => {
		setPrevClicked(true);
		var curr_section = currentSection;
		var curr_question = currentQuestion;

		if (
			currentAnswer === -1 ||
			(typeof currentAnswer === 'object' && currentAnswer.length === 0)
		) {
		} else {
			var tempAnswers = answer;
			if (tempAnswers[curr_section] == undefined) {
				tempAnswers[currentSection] = [];
			}
			tempAnswers[currentSection][currentQuestion] = {
				question_id:
					feedback_form['sections'][curr_section]['questions'][curr_question][
						'_id'
					].toString(),
				answer: currentAnswer,
			};
			setAnswer(tempAnswers);
		}

		if (currentQuestion == 0) {
			if (currentSection == 0) {
				console.log('Reached at begining');
			} else {
				curr_section = currentSection - 1;
				curr_question =
					feedback_form['sections'][currentSection - 1].questions.length - 1;
				setCurrentQuestion(curr_question);
				setCurrentSection(curr_section);
			}
		} else {
			curr_question = currentQuestion - 1;
			setCurrentQuestion(curr_question);
		}
		setCurrentAnswer(answer[curr_section][curr_question].answer);
	};

	const nextQuestion = () => {
		setPrevClicked(false);
		var curr_section = currentSection;
		var curr_question = currentQuestion;

		if (
			currentAnswer === -1 ||
			(typeof currentAnswer === 'object' && currentAnswer.length === 0)
		) {
		} else {
			var tempAnswers = answer;
			if (tempAnswers[curr_section] == undefined) {
				tempAnswers[currentSection] = [];
			}
			tempAnswers[currentSection][currentQuestion] = {
				question_id:
					feedback_form['sections'][curr_section]['questions'][curr_question][
						'_id'
					].toString(),
				answer: currentAnswer,
			};

			setAnswer(tempAnswers);
		}

		if (
			currentAnswer === -1 ||
			(typeof currentAnswer === 'object' && currentAnswer.length === 0)
		) {
		} else {
			if (
				feedback_form['sections'][curr_section]['questions'].length ===
				curr_question + 1
			) {
				if (feedback_form['sections'].length === curr_section + 1) {
					console.log('Feedback Form Completed', answer);
				} else {
					curr_section = currentSection + 1;
					curr_question = 0;
					setCurrentSection(currentSection + 1);
					setCurrentQuestion(0);
				}
			} else {
				curr_question = currentQuestion + 1;
				setCurrentQuestion(currentQuestion + 1);
			}

			setCurrentAnswer(
				answer[curr_section]
					? answer[curr_section][curr_question]
						? answer[curr_section][curr_question].answer
							? answer[curr_section][curr_question].answer
							: -1
						: -1
					: -1
			);
			if (
				feedback_form.sections[currentSection].section_id ===
					'5fbffb5245dfde2994e2e4b3' &&
				showPsychoPopup === false
			) {
				alert(
					'No need to click next in this section.\nQuestion will change as soon as you select the answer.'
				);
				setShowPsychoPopup(true);
			}

			console.log(currentSection, currentQuestion, answer);
		}
	};

	const submitResponses = () => {
		var data = {
			formId: authDetails.user.data.form_id,
			studentId: authDetails.user.data.student_id,
			responses: answer,
		};
		console.log(data);
		axios
			.post('/api/responses/create', data)
			.then((res) => {
				console.log(res.data);
				dispatch(logoutUser());
				alert('Your responses are recorded.\nThank You for giving feedback!!');
			})
			.catch((err) => console.log(err, err.response.data));
		console.log(answer);
	};

	const recordAnswer = (ans) => {
		var tempAnswer = answer;
		tempAnswer[currentSection][currentQuestion] = ans;
		nextQuestion();
	};

	useEffect(() => {
		if (
			!prevClicked &&
			feedback_form &&
			feedback_form.sections[currentSection].section_id ===
				'5fbffb5245dfde2994e2e4b3'
		) {
			if (
				currentSection === feedback_form['sections'].length - 1 &&
				currentQuestion ===
					feedback_form['sections'][feedback_form['sections'].length - 1][
						'questions'
					].length
			) {
			} else {
				nextQuestion();
			}
		}
	}, [currentAnswer]);

	const hoverStart = (i) => {
		// console.log(i)
		setCurrentRadio(i);
	};

	const hoverStop = () => {
		setCurrentRadio(-1);
	};

	// useEffect(() => {

	// }, [currentAnswer]);

	return (
		<div>
			<Grid
				container
				direction="column"
				alignItems="center"
				style={{ backgroundColor: '#f3f2ef', height: '34vh' }}
			>
				{/* <Grid item> */}
				<Grid
					container
					direction="column"
					alignItems="center"
					justify="center"
					style={{ height: '10vh', maxWidth: '760px', minWidth: '470px' }}
				>
					<Typography
						className={clsx('text-success', 'clg-name')}
						style={{
							fontWeight: '600',
							textAlign: 'center',
							margin: '0px',
							color: '#0A66C2',
						}}
					>
						RAJIV GANDHI INSTITUTE OF TECHNOLOGY, MUMBAI
					</Typography>
				</Grid>
				{/* </Grid> */}
			</Grid>
			<Grid
				container
				direction="column"
				alignItems="center"
				style={{ backgroundColor: '#f3f2ef', height: '66vh' }}
			>
				<Grid
					item
					style={{
						height: '80vh',
						marginTop: '-24vh',
						borderRadius: '10px 10px 10px 10px',
						boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.8)  ',
					}}
				>
					<Grid container direction="column" style={{ height: '24vh' }}>
						<Grid
							container
							direction="column"
							justify="center"
							alignItems="flex-start"
							style={{
								backgroundColor: '#0A66C2',
								maxWidth: '700px',
								width: '460px',
								height: '24vh',
								borderRadius: '10px 10px 0px 0px',
							}}
						>
							<Grid item>
								<Typography
									variant="h5"
									style={{
										color: '#f6f8f8',
										textAlign: 'start',
										letterSpacing: '0.8px',
										marginLeft: '20px',
										fontWeight: '600',
									}}
								>
									{feedback_form !== undefined
										? feedback_form['sections'][currentSection]['name']
										: 'Loading'}
								</Typography>
							</Grid>
							<Grid item>
								<Typography
									variant="body2"
									style={{
										color: '#f6f8f8',
										marginLeft: '20px',
										marginTop: '10px',
									}}
								>
									{feedback_form !== undefined
										? feedback_form['sections'][currentSection]['name'] +
										  ' of teacher'
										: 'Loading'}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid container direction="column" justify="space-between">
						<Grid
							container
							direction="column"
							justify="center"
							alignItems="center"
							style={{
								backgroundColor: '#ffffff',
								height: '56vh',
								width: '460px',
								borderRadius: '0px 0px 10px 10px',
							}}
						>
							<Grid item style={{ paddingLeft: '20px', paddingRight: '20px' }}>
								<Typography
									variant="h6"
									style={{
										color: '#474442',
										textAlign: 'center',
										letterSpacing: '0.5px',
										fontWeight: '400',
									}}
								>
									{feedback_form !== undefined
										? feedback_form['sections'][currentSection]['questions'][
												currentQuestion
										  ]['question']
										: 'Loading'}
								</Typography>
							</Grid>
							<Grid item style={{ marginTop: '0px' }}>
								{feedback_form !== undefined ? (
									feedback_form['sections'][currentSection]['questions'][
										currentQuestion
									]['questiontype'] === 'radio' ? (
										gender === 'male' ? (
											<React.Fragment>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(0)}
													onMouseEnter={() => hoverStart(0)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
												>
													<Boy_1
														color={
															currentRadio === 0 || currentAnswer === 0
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(1)}
													onMouseEnter={() => hoverStart(1)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
												>
													<Boy_2
														color={
															currentRadio === 1 || currentAnswer === 1
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(2)}
													onMouseEnter={() => hoverStart(2)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
												>
													<Boy_3
														color={
															currentRadio === 2 || currentAnswer === 2
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(3)}
													onMouseEnter={() => hoverStart(3)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
												>
													<Boy_4
														color={
															currentRadio === 3 || currentAnswer === 3
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(4)}
													onMouseEnter={() => hoverStart(4)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
												>
													<Boy_5
														color={
															currentRadio === 4 || currentAnswer === 4
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
											</React.Fragment>
										) : (
											<React.Fragment>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(0)}
													onMouseEnter={() => hoverStart(0)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
													component="span"
												>
													<Girl_1
														color={
															currentRadio === 0 || currentAnswer === 0
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(1)}
													onMouseEnter={() => hoverStart(1)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
													component="span"
												>
													<Girl_2
														color={
															currentRadio === 1 || currentAnswer === 1
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(2)}
													onMouseEnter={() => hoverStart(2)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
													component="span"
												>
													<Girl_3
														color={
															currentRadio === 2 || currentAnswer === 2
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(3)}
													onMouseEnter={() => hoverStart(3)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
													component="span"
												>
													<Girl_4
														color={
															currentRadio === 3 || currentAnswer === 3
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
												<IconButton
													disableFocusRipple
													style={{ margin: '5px' }}
													onClick={() => setCurrentAnswer(4)}
													onMouseEnter={() => hoverStart(4)}
													onMouseLeave={() => hoverStop()}
													aria-label="upload picture"
													component="span"
												>
													<Girl_5
														color={
															currentRadio === 4 || currentAnswer === 4
																? '#0A66C2'
																: '#BBBBBB'
														}
													/>
												</IconButton>
											</React.Fragment>
										)
									) : feedback_form['sections'][currentSection]['questions'][
											currentQuestion
									  ]['questiontype'] === 'checkbox' ? (
										<React.Fragment>
											{feedback_form['sections'][currentSection]['questions'][
												currentQuestion
											]['options'].map((option) => {
												return (
													<FormControlLabel
														value={option}
														control={
															<Checkbox
																color="primary"
																defaultChecked={
																	typeof currentAnswer === 'object'
																		? currentAnswer.indexOf(option) > -1
																		: false
																}
																onChange={(e) => handleCheckBoxAnswer(e)}
															/>
														}
														label={option}
														labelPlacement="bottom"
													/>
												);
											})}
										</React.Fragment>
									) : (
										<TextField
											id="comment-textfield"
											label={
												'Comment / Suggestion on ' +
												feedback_form['sections'][currentSection]['name']
											}
											multiline
											placeholder="Please mention your comment here"
											style={{ minWidth: '400px', marginTop: '10px' }}
											rows={4}
											onChange={(e) => setCurrentAnswer(e.target.value)}
											defaultValue=""
											variant="outlined"
										/>
									)
								) : (
									'Loading'
								)}
							</Grid>
							<Grid item style={{ marginTop: '0px', color: 'red' }}>
								{currentAnswer === -1 ||
								(typeof currentAnswer === 'object' &&
									currentAnswer.length === 0)
									? 'Please select atleast one option'
									: ''}
							</Grid>
							{feedback_form !== undefined ? (
								currentSection === feedback_form['sections'].length - 1 &&
								currentQuestion ===
									feedback_form['sections'][
										feedback_form['sections'].length - 1
									]['questions'].length -
										1 ? (
									<Grid item style={{ marginTop: '40px' }}>
										<Button
											variant="outlined"
											style={{
												color: 'rgb(10, 102, 194)',
												borderColor: '#0A66C2',
												margin: '5px',
											}}
											onClick={previousQuestion}
										>
											Previous
										</Button>
										<Button
											variant="contained"
											style={{ background: '#0A66C2', margin: '5px' }}
											color="primary"
											onClick={submitResponses}
										>
											Submit
										</Button>
									</Grid>
								) : (
									<Grid item style={{ marginTop: '40px' }}>
										<Button
											variant="outlined"
											style={{
												color: 'rgb(10, 102, 194)',
												borderColor: '#0A66C2',
												margin: '5px',
											}}
											onClick={previousQuestion}
										>
											Previous
										</Button>
										<Button
											variant="contained"
											style={{ background: '#0A66C2', margin: '5px' }}
											color="primary"
											onClick={nextQuestion}
										>
											Next
										</Button>
									</Grid>
								)
							) : (
								<h4>Loading</h4>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

// [
//     [4, 3, 4, 3, 3, "subject command of teacher!"],
//     [4, 3, Array(2), "punctuality of teachers"],
//     [Array(2), 3, " teaching methodology", 3],
//     [2, 3, 2, "students interaction and doubt solving"],
//     [3, 2, 3, 2, "Behavior and discipline of the teacher"],
//     [2, 3, 3, 3, 2, 3, 4],
// ];

// 0: (6) [4, 3, 4, 3, 3, "subject command of teacher!"]
// 1: (4) [4, 3, Array(2), "punctuality of teachers"]
// 2: (4) [Array(2), 3, " teaching methodology", 3]
// 3: (4) [2, 3, 2, "students interaction and doubt solving"]
// 4: (5) [3, 2, 3, 2, "Behavior and discipline of the teacher"]
// 5: (7) [2, 3, 3, 3, 2, 3, 4]

export default FeedbackForm;
