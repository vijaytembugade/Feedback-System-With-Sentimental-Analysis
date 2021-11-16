import React from 'react';
// import logo from './logo.svg';
import './App.css';
import store from './store';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { decode } from 'querystring';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './component/Admin/Dashboard';
import Students from './component/Admin/Student/Students';
import Teachers from './component/Admin/Teacher/Teachers';
import FeedbackForms from './component/Admin/Feedback_Form';
import FeedbackForm from './component/Student/FeedbackForm';
import AdminLogin from './component/Auth/AdminLogin';
import StudentLogin from './component/Auth/StudentLogin';
import AdminPrivateRoute from './common/AdminPrivateRoute';
import ShortLinkValidation from './component/Auth/ShortLinkValidation';
import StudentPrivateRoute from './common/StudentPrivateRoute';
import StudentAuthError from './component/Student/StudentAuthError';
import CreateQuestionPaper from './component/Admin/Feedback_Form/Question_Paper/CreateQuestionPaper';
import {
	getAllForms,
	getAllStudents,
	getAllTeachers,
} from './actions/adminActions';
import Report from './component/Admin/Report';

//check for token
if (localStorage.jwtToken) {
	//set auth token header auth
	setAuthToken(localStorage.jwtToken);
	//decode the token and tget user info and exp
	const decoded = jwt_decode(localStorage.jwtToken);
	//set user and isauthenticated
	store.dispatch(setCurrentUser(decoded));

	//check for expiring token
	const currentTime = Date.now() / 1000;
	if (decode.exp < currentTime) {
		//logout
		store.dispatch(logoutUser());
		//dispatch clear current profile
		//    store.dispatch(clearCurrentProfile())

		//todo: clear current Profile
		//redirect to login
		window.location.href = '/admin-login';
	} else {
		store.dispatch(getAllStudents());
		store.dispatch(getAllTeachers());
		store.dispatch(getAllForms());
	}
}

function App() {
	return (
		<Provider store={store}>
			<Router>
				<div className="App">
					<AdminPrivateRoute exact path="/" component={Dashboard} />
					<Route exact path="/admin-login" component={AdminLogin} />
					<Route exact path="/short/:hash_string" component={StudentLogin} />
					<Switch>
						<AdminPrivateRoute
							exact
							path="/admin/teachers"
							component={Teachers}
						/>
						<AdminPrivateRoute
							exact
							path="/admin/students"
							component={Students}
						/>
						<AdminPrivateRoute
							exact
							path="/admin/feedbackforms"
							component={FeedbackForms}
						/>
					</Switch>
					<Switch>
						<AdminPrivateRoute
							exact
							path="/admin/generate/report/:form_id"
							component={Report}
						/>
					</Switch>
					<Switch>
						<Route exact path="/student/error" component={StudentAuthError} />
						<StudentPrivateRoute
							exact
							path="/student/feedback-form"
							component={FeedbackForm}
						/>
					</Switch>
					<Switch>
						<Route
							exact
							path="/amit/create-question-paper"
							component={CreateQuestionPaper}
						/>
					</Switch>
				</div>
			</Router>
		</Provider>
	);
}

export default App;
