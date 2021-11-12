import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FlagIcon from '@material-ui/icons/Flag';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { TextField } from '@material-ui/core';

const styles = {
	dialogBox: {
		maxWidth: '500px',
		margin: 'auto',
	},
};

export class Report extends Component {
	state = {
		open: false,
		reason: '',
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

	report = () => {
		this.props.onclick(this.state.reason);
		this.setState({
			open: false,
		});
	};

	render() {
		const { classes } = this.props;
		return (
			<>
				<Tooltip title="report" placement="top">
					<IconButton onClick={this.handleOpen}>
						<FlagIcon style={{ color: 'red' }} fontSize="small" />
					</IconButton>
				</Tooltip>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					maxWidth="sm"
					className={classes.dialogBox}
				>
					<TextField
						placeholder="State your reason"
						style={{ padding: 5, width: '90%', margin: 'auto' }}
						onChange={(e) =>
							this.setState({ ...this.state, reason: e.target.value })
						}
					/>
					<DialogActions style={{ margin: 'auto' }}>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={this.report} style={{ color: '#FF0000' }}>
							Report
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
}

export default withStyles(styles)(Report);
