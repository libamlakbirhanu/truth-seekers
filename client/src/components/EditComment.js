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

const styles = (theme) => ({
	...theme.spreadIt,
});

class EditDetails extends Component {
	state = {
		body: '',
		open: false,
	};

	mapDetailsToState = (comment) => {
		this.setState({
			body: comment.body ? comment.body : '',
		});
	};

	handleOpen = () => {
		this.mapDetailsToState(this.props.comment);
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
		const { comment } = this.props;
		const details = {
			id: comment._id,
			body: this.state.body.trim(),
		};

		if (details.body !== comment.body) {
			this.props.edit(details);
			this.handleClose();
		}
	};

	onChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	editButton =
		this.props.userId === this.props.comment.author._id ? (
			<Tooltip title="edit comment" placement="top">
				<IconButton onClick={this.handleOpen} className="editButton">
					<EditIcon color="primary" fontSize="small" />
				</IconButton>
			</Tooltip>
		) : null;

	render() {
		const { classes } = this.props;

		return (
			<>
				{this.editButton}
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					maxWidth="sm"
				>
					<DialogTitle>Edit comment</DialogTitle>
					<DialogContent>
						<form>
							<TextField
								name="body"
								type="text"
								label="comment"
								placeholder="comment"
								className={classes.textField}
								value={this.state.body}
								onChange={this.onChange}
								multiline
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
							color="primary"
						>
							<span style={{ fontSize: 14 }}>Save</span>
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
}

export default withStyles(styles)(EditDetails);
