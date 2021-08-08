import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';

import { connect } from 'react-redux';

const styles = (theme) => ({
	...theme.spreadIt,
});

class EditDetails extends Component {
	state = {
		[this.props.details.firstTextField]: '',
		[this.props.details.secondTextField]: '',
		originalDetail: this.props.target,
		open: false,
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			!nextProps.loading &&
			!nextProps.errors.title &&
			!nextProps.errors.body &&
			nextProps.target.title &&
			(nextProps.target.title !== this.state.originalDetail.title ||
				nextProps.target.body !== this.state.originalDetail.body)
		) {
			this.setState({
				...this.state,
				originalDetail: {
					title: nextProps.target.title,
					body: nextProps.target.body,
				},
			});
			this.handleClose();
		}
	}

	mapDetailsToState = (target) => {
		const { firstTextField, secondTextField } = this.props.details;

		this.setState({
			[firstTextField]: target[firstTextField] ? target[firstTextField] : '',
			[secondTextField]: target[secondTextField] ? target[secondTextField] : '',
		});
	};

	handleOpen = () => {
		this.mapDetailsToState(this.props.target);
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
		const {
			target,
			details: { firstTextField, secondTextField },
		} = this.props;
		const details = {
			id: target._id,
			[firstTextField]: this.state[firstTextField].trim().toLowerCase(),
			[secondTextField]: this.state[secondTextField].trim().toLowerCase(),
		};

		if (
			details[firstTextField] !== target[firstTextField] ||
			details[secondTextField] !== target[secondTextField]
		) {
			this.props.edit(details);
		}
	};

	onChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	render() {
		const {
			classes,
			details: { firstTextField, secondTextField },
			errors,
		} = this.props;
		const classname =
			firstTextField === 'title' ? 'editButton editSeek' : 'editButton';

		return (
			<>
				<Tooltip
					title={
						firstTextField === 'title' ? 'edit seek' : 'edit profile details'
					}
					placement="top"
				>
					<IconButton className={classname} onClick={this.handleOpen}>
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
								name={firstTextField}
								type="text"
								label={firstTextField}
								placeholder={firstTextField}
								className={classes.textField}
								helperText={
									firstTextField === 'title' &&
									(errors && errors.title ? errors.title : '')
								}
								error={errors && errors.title ? true : false}
								value={this.state[firstTextField]}
								onChange={this.onChange}
							/>
							<TextField
								name={secondTextField}
								type={secondTextField === 'email' ? 'email' : 'text'}
								label={secondTextField}
								placeholder={secondTextField}
								className={classes.textField}
								helperText={
									secondTextField === 'body' &&
									(errors && errors.body ? errors.body : '')
								}
								error={errors && errors.body ? true : false}
								value={this.state[secondTextField]}
								multiline={!(secondTextField === 'email')}
								onChange={this.onChange}
								disabled={secondTextField === 'email'}
								title={
									secondTextField === 'email' &&
									'you are not allowed to change the email'
								}
							/>
						</form>
					</DialogContent>

					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							<span style={{ fontSize: 14 }}>Cancel</span>
						</Button>
						<Button
							onClick={this.handleSubmit}
							variant="contained"
							disabled={this.props.loading}
							color="primary"
						>
							{this.props.loading && (
								<CircularProgress
									size={30}
									className={classes.progressLoader}
								/>
							)}
							<span style={{ fontSize: 14 }}>Save</span>
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		errors: state.data.errors,
		loading: state.UI.loading,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(EditDetails));
