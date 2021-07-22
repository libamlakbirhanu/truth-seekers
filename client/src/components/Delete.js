import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
	dialogBox: {
		maxWidth: '500px',
		margin: 'auto',
	},
};

export class Delete extends Component {
	state = {
		open: false,
	};

	handleOpen = () => {
		this.setState({
			open: true,
		});
	};

	handleClose = () => {
		this.setState({
			open: false,
		});
	};

	delete = () => {
		this.props.onclick();
		this.setState({
			open: false,
		});
	};

	render() {
		const { classes, target } = this.props;
		return (
			<>
				<Tooltip title="delete" placement="top">
					<IconButton onClick={this.handleOpen}>
						<DeleteOutlineIcon style={{ color: 'red' }} fontSize="small" />
					</IconButton>
				</Tooltip>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					maxWidth="sm"
					className={classes.dialogBox}
				>
					<DialogTitle>{`Are you sure you want to delete this ${target}?`}</DialogTitle>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.delete} style={{ color: '#FF0000' }}>
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
}

export default withStyles(styles)(Delete);
