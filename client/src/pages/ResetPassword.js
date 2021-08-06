import React, { useState } from 'react';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { resetPass } from './../redux/actions/userActions';

const styles = (theme) => ({
	...theme.spreadIt,
	resetForm: {
		maxWidth: '300px',
	},
});

const textStyle = {
	display: 'inline',
	color: '#800080',
	marginLeft: '10px',
	fontSize: 36,
	textAlign: 'center',
};

function ResetPassword({ resetPass, classes, UI, history }) {
	const [inputFields, setInputFields] = useState({
		password: '',
		confirmPassword: '',
	});

	let token;
	const noToken =
		window.location.pathname.endsWith('resetpassword') ||
		window.location.pathname.endsWith('resetpassword/');

	if (!noToken) {
		const splittedPathname = window.location.pathname.split('/');
		token = splittedPathname[splittedPathname.length - 1];
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		resetPass(token, inputFields, history);
	};

	const handleChange = (event) => {
		setInputFields({
			...inputFields,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				marginTop: '150px',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					justifyContent: 'center',
					maxWidth: '500px',
				}}
			>
				{!noToken ? (
					<>
						{UI.error && (
							<div className={classes.errorBox}>{UI.error.message}</div>
						)}
						<form
							onSubmit={handleSubmit}
							className={classes.resetForm}
							style={{ marginTop: '20px' }}
						>
							<TextField
								id="password"
								name="password"
								type="password"
								label="New password"
								className={classes.textField}
								value={inputFields.password}
								onChange={handleChange}
								required
							></TextField>
							<TextField
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								label="Confirm Password"
								className={classes.textField}
								value={inputFields.confirmPassword}
								onChange={handleChange}
								required
							></TextField>

							<Button
								type="submit"
								variant="contained"
								color="primary"
								className={classes.button}
								disabled={
									UI.loading ||
									inputFields.password !== inputFields.confirmPassword
								}
							>
								reset
								{UI.loading && (
									<CircularProgress
										className={classes.progress}
										size={25}
									></CircularProgress>
								)}
							</Button>
						</form>
					</>
				) : (
					<h3 id="notFound" style={textStyle}>
						An email has been successfully sent to your account. Follow the
						instructions to reset your password
					</h3>
				)}
			</div>
		</div>
	);
}

const mapStateToProps = (state) => {
	return { UI: state.UI };
};

export default connect(mapStateToProps, { resetPass })(
	withStyles(styles)(ResetPassword)
);
