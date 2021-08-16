import React, { Component } from 'react';
import { withRouter } from 'react-router';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { connect } from 'react-redux';
import { deactivate } from '../redux/actions/userActions';

const styles = {
	dialogBox: {
		maxWidth: '500px',
		margin: 'auto',
	},
};

export class Deactivate extends Component {
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
		this.setState({
			open: false,
		});
		this.props.deactivate(this.props.history);
	};

	render() {
		const { classes } = this.props;
		return (
			<>
				<Button
					type="submit"
					variant="contained"
					onClick={this.handleOpen}
					className={classes.button}
					style={{
						float: 'right',
						marginTop: '10px',
						backgroundColor: '#c4000085',
					}}
					id="deactivate"
				>
					Deactivate account
				</Button>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					fullWidth
					maxWidth="sm"
					className={classes.dialogBox}
				>
					<DialogTitle>{`Are you sure you want to delete this account?`}</DialogTitle>
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

export default connect(null, { deactivate })(
	withRouter(withStyles(styles)(Deactivate))
);
