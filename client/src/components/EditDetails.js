import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';

import { connect } from 'react-redux';

import { editUser } from '../redux/actions/userActions';

const styles = (theme) => ({
	...theme.spreadIt,
});

class EditDetails extends Component {
	state = {
		name: '',
		email: '',
		open: false,
	};

	mapUserDetailsToState = (user) => {
		this.setState({
			name: user.name ? user.name : '',
			email: user.email ? user.email : '',
		});
	};

	componentDidMount() {
		const { user } = this.props;

		this.mapUserDetailsToState(user.currentUser);
	}

	handleOpen = () => {
		this.mapUserDetailsToState(this.props.user.currentUser);
		this.setState({
			open: true,
		});
	};

	handleClose = () => {
		this.setState({
			open: false,
		});
	};

	handleSubmit = () => {
		const { name, email } = this.props.user.currentUser;
		const userDetails = {
			name: this.state.name.trim().toLowerCase(),
			email: this.state.email.trim().toLowerCase(),
		};

		if (userDetails.name !== name || userDetails.email !== email) {
			if (this.props.editUser(userDetails)) {
				this.handleClose();
			}
		} else this.handleClose();
	};

	onChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	render() {
		const { classes } = this.props;
		return (
			<>
				<Tooltip title="edit profile details" placement="top">
					<IconButton className="editButton" onClick={this.handleOpen}>
						<EditIcon color="primary" fontSize="small" />
					</IconButton>
				</Tooltip>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					maxWidth="sm"
				>
					<DialogTitle>Edit profile details</DialogTitle>
					<DialogContent>
						<form>
							<TextField
								name="name"
								type="text"
								label="name"
								placeholder="user name"
								className={classes.textField}
								value={this.state.name}
								onChange={this.onChange}
							/>
							<TextField
								name="email"
								type="email"
								label="email"
								placeholder="user email"
								className={classes.textField}
								value={this.state.email}
								onChange={this.onChange}
							/>
						</form>
					</DialogContent>

					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							<span style={{ fontSize: 14 }}>Cancel</span>
						</Button>
						<Button onClick={this.handleSubmit} color="primary">
							<span style={{ fontSize: 14 }}>Save</span>
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user,
});

const mapStateToDispatch = {
	editUser,
};

export default connect(
	mapStateToProps,
	mapStateToDispatch
)(withStyles(styles)(EditDetails));
