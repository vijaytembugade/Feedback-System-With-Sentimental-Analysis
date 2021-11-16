import {
	Button,
	Grid,
	TextField,
	Typography,
	fade,
	makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { loginAdmin } from "../../actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		alignItems: "center",
	},
	border: {
		borderBottom: "2px solid #cdcfd2",
		width: "100%",
	},
	content: {
		paddingTop: theme.spacing(0.5),
		paddingBottom: theme.spacing(0.5),
		paddingRight: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		fontWeight: 400,
		fontSize: 16,
		color: "#000000e6",
	},
	primaryButton: {
		backgroundColor: "#0A66C2",
		color: "#FFF",
		"&:hover": {
			backgroundColor: "#0052a4",
			color: "#FFF",
		},
	},
	standardButton: {
		// backgroundColor: '#0A66C2',
		color: "#0A66C2",
		"&:hover": {
			backgroundColor: "#0a66c20a",
			color: "#0A66C2",
		},
	},
}));

const useStylesRedditInput = makeStyles((theme) => ({
	root: {
		border: "1px solid #e2e2e1",
		overflow: "hidden",
		borderRadius: 4,
		backgroundColor: "#fcfcfb",
		transition: theme.transitions.create(["border-color", "box-shadow"]),
		"&:hover": {
			backgroundColor: "#fff",
		},
		"&$focused": {
			backgroundColor: "#fff",
			boxShadow: `${fade("#0A66C2", 0.25)} 0 0 0 2px`,
			borderColor: "#0A66C2",
		},
	},
	focused: {},
}));

const AdminLogin = () => {
	const classes = useStyles();
	const [details, setDetail] = useState();
	const textFieldClasses = useStylesRedditInput();
	const dispatch = useDispatch();
	const authDetails = useSelector((state) => state.auth);
	const history = useHistory();

	useEffect(() => {
		if (authDetails.isAuthenticated && authDetails.user.data.role === "admin")
			history.push("/");
	});

	function handleLogin(e) {
		e.preventDefault();
		const userData = {
			email: details.email,
			password: details.password,
		};

		console.log("onsubmit login", userData);
		dispatch(loginAdmin(userData));
	}
	function handleChange(e) {
		e.preventDefault();
		setDetail({
			...details,
			[e.target.name]: e.target.value,
		});
	}

	return (
		<div>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
				style={{ height: "100vh" }}
			>
				<Grid
					container
					direction="column"
					style={{
						width: "400px",
						background: "#fff",
						borderRadius: "10px",
						padding: "40px 20px",
					}}
				>
					<Grid item xs={12}>
						<Typography
							style={{
								fontSize: "24px",
								lineHeight: "1.33333",
								fontWeight: "600",
								color: "rgba(0,0,0,0.9)",
								padding: "0 0 4px 0",
							}}
						>
							Welcome Back
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography
							style={{
								fontSize: "16px",
								lineHeight: "1.75",
								fontWeight: "400",
								color: "rgba(0,0,0,0.6)",
								paddingBottom: "32px",
							}}
						>
							Don't miss your next opportunity. Sign in to stay updated on your
							professional world.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							InputProps={{ classes: textFieldClasses, disableUnderline: true }}
							variant="filled"
							id="email-field"
							label="Email"
							name="email"
							onChange={(e) => handleChange(e)}
							style={{ width: "100%", marginBottom: "12px" }}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							InputProps={{ classes: textFieldClasses, disableUnderline: true }}
							label="Reddit"
							variant="filled"
							id="password-field"
							label="Password"
							type="password"
							name="password"
							onChange={(e) => handleChange(e)}
							style={{ width: "100%", marginBottom: "12px" }}
						/>
					</Grid>

					<Grid item xs={12}>
						<Button
							variant="contained"
							className={classes.primaryButton}
							style={{
								width: "100%",
								fontSize: "16px",
								lineHeight: "1.75",
								fontWeight: "400",
								marginTop: "8px",
							}}
							onClick={(e) => handleLogin(e)}
						>
							Sign in
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button
							color="primary"
							className={classes.standardButton}
							style={{
								width: "100%",
								fontSize: "14px",
								lineHeight: "1.75",
								fontWeight: "400",
								marginTop: "8px",
							}}
						>
							Forgot password
						</Button>
					</Grid>
					<div className={classes.container}>
						<div className={classes.border} />
						<Typography className={classes.content}>or</Typography>
						<div className={classes.border} />
					</div>
					<Grid item xs={12}>
						<Typography
							style={{
								fontSize: "16px",
								fontWeight: "400",
								color: "rgba(0,0,0,0.6)",
								marginTop: "8px",
							}}
						>
							Student Login?
							<Button
								color="primary"
								className={classes.standardButton}
								style={{
									fontSize: "14px",
									lineHeight: "1.75",
									fontWeight: "400",
								}}
							>
								Click here
							</Button>
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default AdminLogin;
