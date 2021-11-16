import React, { useEffect, useState } from 'react';
import {
	Button,
	TextField,
	MenuItem,
	Container,
	createMuiTheme,
	Divider,
	Grid,
	IconButton,
	makeStyles,
	Paper,
	SwipeableDrawer,
	ThemeProvider,
	Tooltip,
	Typography,
} from '@material-ui/core';
import SideBar from '../SideBar';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import CreateQuestionPaper from './Question_Paper/CreateQuestionPaper';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { useHistory } from 'react-router-dom';
import AssessmentRoundedIcon from '@material-ui/icons/AssessmentRounded';
import {
	getAllTeachers,
	getAllStudents,
	getAllForms,
} from '../../../actions/adminActions';
import { useTable } from 'react-table';
import Table from '../../Table';

// import Example from './try'

const styles = makeStyles((theme) => ({
	section: {
		margin: theme.spacing(2),
	},
	sectionPaper: {
		padding: theme.spacing(2),
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	content: {
		// flexGrow: 1,
		padding: theme.spacing(3),
		marginLeft: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(9) + 1,
		},
	},
	tempBorder: {
		border: '2px solid black',
	},
}));

const handleEdit = () => {};

const handleDelete = () => {};

const drawerTheme = createMuiTheme({
	overrides: {
		// Style sheet name ⚛️
		MuiDrawer: {
			// Name of the rule
			paper: {
				// Some CSS
				maxWidth: '550px',
				paddingTop: '10px',
				paddingBottom: '20px',
			},
		},
	},
});

const FeedbackForms = () => {
	const classes = styles();
	const [open, setOpen] = useState(false);
	const [openType, setOpenType] = useState('none');
	const history = useHistory();
	const [currentStep, setCurrentStep] = useState(0);
	const [message, setMessage] = useState('click the generate report button');

	const [newForm, setNewForm] = useState({
		students: ['5f5a75401d83720ef0bfbaf2', '5fd7b30c75b10d4a503b9a02'],
	});
	const feedbackForms = useSelector((state) =>
		state.admin.feedback_forms ? state.admin.feedback_forms : []
	);
	const students = useSelector((state) => state.admin.students);
	const teachers = useSelector((state) =>
		state.admin.teachers.length > 0 ? state.admin.teachers : []
	);

	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(getAllStudents());
		dispatch(getAllTeachers());
		dispatch(getAllForms());
	}, []);

	const toggleDrawer = (val) => (event) => {
		setOpen(val);
		if (val == false) {
			setCurrentStep(0);
		}
	};

	const handleCancel = () => {};
	const handleSubmit = () => {
		var tempStudents = students.map((s) => s._id);
		axios
			.post('/api/feedbackforms/create', {
				form_name: newForm.form_name,
				teacher_details: {
					teacher_id: newForm.teacher._id,
					subject: newForm.subject,
				},
				sections: [
					'5fa8eade56d5b242c8ff34a9',
					'5fa8eb1f56d5b242c8ff34aa',
					'5fa8ec1a56d5b242c8ff34ac',
					'5fa8ec7556d5b242c8ff34ad',
					'5fa8ecdc56d5b242c8ff34ae',
					'5fbffb5245dfde2994e2e4b3',
				],
				selected_students: tempStudents,
				// [
				// 	'607343956ecd7b47ec8c7b23',
				// 	'6073435a6ecd7b47ec8c7b22',
				// 	'607343fa6ecd7b47ec8c7b24',
				// ],
			})
			.then((res) => {
				console.log(res.data);
				let promises = [];
				axios
					.post('/api/auth/student/register', {
						student_id: tempStudents,
						//  [
						// 	'607343956ecd7b47ec8c7b23',
						// 	'6073435a6ecd7b47ec8c7b22',
						// 	'607343fa6ecd7b47ec8c7b24',
						// ],
						form_id: res.data._id,
					})
					.then((res1) => {
						console.log(res1.data);
						dispatch(getAllForms());
						toggleDrawer(false);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log('error in creating form', err, err.response);
			});
	};

	const options = {
		filterType: 'dropdown',
		responsive: 'standard',
		customToolbarSelect: (selectedRows) => {
			var index = selectedRows.data.map((i) => i.dataIndex);

			return (
				<div className={classes.iconContainer}>
					{index.length === 1 && (
						<Tooltip title={'Edit'}>
							<IconButton onClick={async () => await handleEdit(index[0])}>
								<CreateIcon />
							</IconButton>
						</Tooltip>
					)}
					<Tooltip title={'Delete'}>
						<IconButton onClick={async () => await handleDelete(index)}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</div>
			);
		},
	};

	const data = React.useMemo(() => feedbackForms, [feedbackForms]);

	const columns = React.useMemo(
		() => [
			{
				accessor: '_id',
				Header: 'ID',
			},
			{
				accessor: 'form_name',
				Header: 'Form Name',
			},
			{
				accessor: 'teacher',
				Header: 'Teacher Name',
				Cell: ({ row }) => {
					var temp = {};
					if (teachers.length > 0) {
						temp = teachers.filter(
							(teacher) => teacher._id == row.original.teacher_id
						)[0];
						console.log(temp, row.original, teachers);
						return temp.fname + ' ' + temp.lname;
					} else {
						return '';
					}
				},
			},
			{
				accessor: 'subject',
				Header: 'Subject',
			},
			{
				accessor: 'students',
				Header: 'Students Selected',
				Cell: ({ row }) => {
					return row.original.selected_students
						? row.original.selected_students.length
						: 0;
				},
			},
			{
				id: 'actions',
				Header: 'Action',
				Cell: ({ row }) => {
					var formId = row.original._id;
					return (
						<IconButton
							onClick={() => {
								history.push(`/admin/generate/report/${formId}`);
							}}
						>
							<AssessmentRoundedIcon />
						</IconButton>
					);
				},
			},
		],
		[teachers]
	);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'teacher') {
			setNewForm((prevState) => {
				return {
					...prevState,
					[name]: teachers[value],
				};
			});
		} else if (name === 'subject') {
			// console.log(name, newForm['teacher'].subjects[value]);
			setNewForm((prevState) => {
				return {
					...prevState,
					[name]: prevState['teacher'].subjects[value],
				};
			});
		} else {
			setNewForm((prevState) => {
				return {
					...prevState,
					[name]: value,
				};
			});
		}
	};

	const generateReport = () => {
		setMessage('loading');
		axios
			.post('/api/reports/generate')
			.then((res) => {
				console.log(res);
				setMessage(res.data.body);
			})
			.catch((err) => {
				setMessage('error');
				console.log(err, err.response.data);
			});
	};

	return (
		<div className={classes.content}>
			<div className={classes.toolbar} />
			<SideBar />
			<Paper className={classes.sectionPaper} elevation={2}>
				<Grid
					container
					direction="column"
					alignItems="flex-start"
					style={{ marginBottom: '10px' }}
				>
					<Grid item>
						<Button
							variant="contained"
							color="primary"
							size="small"
							className={classes.button}
							onClick={() => {
								setOpenType('create');
								setOpen(true);
							}}
							startIcon={<PersonAddIcon />}
						>
							Add
						</Button>
					</Grid>
				</Grid>

				<Table columns={columns} data={data} />
			</Paper>

			<ThemeProvider theme={drawerTheme}>
				<SwipeableDrawer
					anchor={'right'}
					className={classes.swipeableDrawer}
					open={open}
					onClose={toggleDrawer(false)}
					onOpen={toggleDrawer(true)}
				>
					<Grid
						container
						direction="column"
						style={{ height: '100%' }}
						justify="space-between"
					>
						<Grid item>
							<Container>
								<Grid item>
									<Typography
										className={classes.formControl}
										variant="h5"
										gutterBottom
									>
										Create New Feedback Form
									</Typography>
									<Typography
										className={classes.formControl}
										style={{ wordWrap: 'break-word' }}
										variant="caption"
										gutterBottom
									>
										Fill the details for creating new feedback form & click{' '}
										<b>SUBMIT</b> button. Click <b>CANCEL</b> button to cancel
										the operation
									</Typography>
								</Grid>
							</Container>
							<Divider className={classes.divider} />
							{currentStep == 0 ? (
								<Container>
									<Grid container direction="column">
										<Grid container justify="space-between">
											<Grid item xs={12}>
												<TextField
													id="form_name"
													name="form_name"
													fullWidth
													className={classes.formControl}
													label="Form Name"
													value={newForm.form_name ? newForm.form_name : ''}
													helperText="Form Name"
													variant="outlined"
													onChange={handleChange}
												/>
											</Grid>
										</Grid>
										<Grid container justify="space-between">
											<Grid item xs={12}>
												<TextField
													id="teacher"
													name="teacher"
													select
													fullWidth
													label="Select teacher"
													className={classes.formControl}
													defaultValue={
														newForm.teacher
															? newForm.teacher.fname +
															  ' ' +
															  newForm.teacher.lname
															: ''
													}
													onChange={handleChange}
													helperText="Teacher Name"
													variant="outlined"
												>
													{teachers.map((option, index) => (
														<MenuItem key={option._id} value={index}>
															{option.fname + ' ' + option.lname}
														</MenuItem>
													))}
												</TextField>
											</Grid>
										</Grid>
										<Grid container justify="space-between">
											<Grid item xs={12}>
												<TextField
													id="subject"
													name="subject"
													select
													fullWidth
													label="Select Subject"
													className={classes.formControl}
													defaultValue={newForm.subject ? newForm.subject : ''}
													onChange={handleChange}
													helperText="Subject"
													variant="outlined"
												>
													{newForm.teacher
														? newForm.teacher.subjects.map((option, index) => (
																<MenuItem key={option} value={index}>
																	{option}
																</MenuItem>
														  ))
														: [].map((option, index) => (
																<MenuItem key={option} value={index}>
																	{option}
																</MenuItem>
														  ))}
												</TextField>
											</Grid>
										</Grid>
										{/* {JSON.stringify(newForm)} */}
									</Grid>
								</Container>
							) : (
								<Container>
									{'Total ' +
										students.length +
										' students will recieve notification for filling the feedback form'}
								</Container>
							)}
						</Grid>
						<Grid item>
							<Container>
								<Grid container spacing={2} justify="flex-end">
									<Grid item>
										<Button
											variant="outlined"
											color="secondary"
											onClick={handleCancel}
										>
											Cancel
										</Button>
									</Grid>
									<Grid item>
										{currentStep == 0 ? (
											<Button
												variant="contained"
												color="primary"
												onClick={() => setCurrentStep(1)}
											>
												Next
											</Button>
										) : (
											<Button
												variant="contained"
												color="primary"
												onClick={handleSubmit}
											>
												Submit
											</Button>
										)}
									</Grid>
								</Grid>
							</Container>
						</Grid>
					</Grid>
				</SwipeableDrawer>
			</ThemeProvider>
		</div>
	);
};

export default FeedbackForms;
