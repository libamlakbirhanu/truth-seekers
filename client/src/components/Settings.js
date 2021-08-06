import React, { useState } from 'react';
import { withRouter } from 'react-router';

import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';

import { updatePassword } from '../redux/actions/userActions';

import Deactivate from './Deactivate';

const styles = (theme) => ({
	...theme.spreadIt,
	successBox: {
		display: 'flex',
		textAlign: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,255,0,.5)',
		marginTop: 20,
		color: 'white',
		padding: 10,
		borderRadius: 10,
		fontSize: 14,
	},
});

const Settings = ({ classes, UI, updatePassword, history }) => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		updatePassword({ oldPassword, newPassword, confirmPassword }, history);
	};

	return (
		<div style={{ width: '100%' }}>
			<div style={{ maxWidth: 400, marginBottom: 10 }}>
				{(UI.error || UI.success) && (
					<div className={UI.error ? classes.errorBox : classes.successBox}>
						{UI.error ? UI.error.message : UI.success}
					</div>
				)}
				<Typography variant="h3" color="primary" id="settingsTitle">
					Update password
				</Typography>
				<form onSubmit={handleSubmit} className={classes.form}>
					<TextField
						id="oldPassword"
						name="oldPassword"
						type="password"
						label="Old Password"
						className={classes.textField}
						value={oldPassword}
						onChange={(event) => setOldPassword(event.target.value)}
						required
					></TextField>
					<TextField
						id="newPassword"
						name="newPassword"
						type="password"
						label="New Password"
						className={classes.textField}
						value={newPassword}
						onChange={(event) => setNewPassword(event.target.value)}
						required
					></TextField>
					<TextField
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						label="Confirm Password"
						className={classes.textField}
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						required
					></TextField>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						className={classes.button}
						disabled={UI.loading && true}
					>
						update password
						{UI.loading && (
							<CircularProgress
								className={classes.progress}
								size={25}
							></CircularProgress>
						)}
					</Button>
				</form>
			</div>
			<Deactivate />
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		UI: state.UI,
	};
};

export default connect(mapStateToProps, { updatePassword })(
	withRouter(withStyles(styles)(Settings))
);
