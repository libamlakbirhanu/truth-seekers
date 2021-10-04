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
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import { connect } from 'react-redux';
import { createSeek, clearErrors } from './../redux/actions/dataActions';

const styles = (theme) => ({
	...theme.spreadIt,
	postButton: {
		position: 'relative',
	},
	progressLoader: {
		position: 'absolute',
	},
	plusIcon: {
		margin: '6px 16px',
	},
});

class PostSeek extends Component {
	state = {
		title: '',
		body: '',
		open: false,
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (!nextProps.loading && !nextProps.errors.title && !nextProps.errors.body)
			this.handleClose();
	}

	handleOpen = () => {
		this.setState({
			open: true,
		});
	};

	handleClose = () => {
		this.setState({
			title: '',
			body: '',
			open: false,
		});
	};

	onChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleSubmit = () => {
		const newSeek = {
			title: this.state.title,
			body: this.state.body,
		};
		this.props.createSeek(newSeek);
	};

	render() {
		const { classes, errors } = this.props;
		return (
			<>
				<Tooltip
					title="post new seek"
					placement="top"
					className={classes.plusIcon}
				>
					<IconButton onClick={this.handleOpen}>
						<AddIcon />
					</IconButton>
				</Tooltip>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					maxWidth="sm"
				>
					<DialogTitle>Post a seek</DialogTitle>
					<DialogContent>
						<form>
							<TextField
								name="title"
								type="text"
								label="title"
								placeholder="title"
								helperText={errors && errors.title ? errors.title : ''}
								error={errors && errors.title ? true : false}
								className={classes.textField}
								value={this.state.title}
								onChange={this.onChange}
							/>
							<TextField
								name="body"
								type="text"
								label="body"
								placeholder="post body"
								helperText={errors.body}
								error={errors.body ? true : false}
								multiline
								rows={3}
								className={classes.textField}
								value={this.state.body}
								onChange={this.onChange}
							/>
						</form>
					</DialogContent>

					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							<span style={{ fontSize: 12 }}>Cancel</span>
						</Button>
						<Button
							onClick={this.handleSubmit}
							variant="contained"
							color="primary"
							disabled={this.props.loading}
							className={classes.postButton}
						>
							{this.props.loading && (
								<CircularProgress
									size={30}
									className={classes.progressLoader}
								/>
							)}
							<span style={{ fontSize: 12 }}>Post</span>
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.UI.loading,
		errors: state.data.errors,
	};
};

export default connect(mapStateToProps, {
	createSeek,
	clearErrors,
})(withStyles(styles)(PostSeek));
