import React, { Component } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { markNotificationsRead } from '../../redux/actions/userActions';

const styles = {
	notificationBox: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: '5px',
		marginBottom: 15,
	},
};

class AdminNotifications extends Component {
	handleOpen = (event) => {
		this.setState({
			anchorEl: event.target,
		});
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	onMenuOpened = () => {
		if (
			this.props.notifications.filter((notification) => !notification.read)
				.length > 0
		)
			this.props.markNotificationsRead();
	};

	render() {
		const { classes } = this.props;
		// const notifications = this.props.notifications;
		const notifications = [
			{
				_id: 1,
				createdAt: Date.now(),
				targetDocument: '12341234123412343',
				message:
					'mother fuckers tryna be all gangster and shit fuck all that non sense',
			},
			{
				_id: 2,
				createdAt: Date.now(),
				targetDocument: '12341234123412343',
				message: 'mother fuckers tryna be all gangster and shit',
			},
			{
				_id: 3,
				createdAt: Date.now(),
				targetDocument: '12341234123412343',
				message:
					'mother fuckers tryna be all gangster and shit fuck all that non sense',
			},
		];

		dayjs.extend(relativeTime);

		let notificationsMarkup =
			notifications && notifications.length > 0 ? (
				notifications.map((not) => {
					const time = dayjs(not.createdAt).fromNow();

					return (
						<div
							key={not._id}
							onClick={this.handleClose}
							className={classes.notificationBox}
						>
							<Typography color="primary" variant="body1">
								{not.message}
								<span
									style={{ display: 'block', fontSize: '12px' }}
									className="weakColor"
								>{` ${time}`}</span>
							</Typography>
						</div>
					);
				})
			) : (
				<div onClick={this.handleClose} className={classes.notificationBox}>
					<Typography variant="body1" color="primary">
						you have no notifications yet
					</Typography>
				</div>
			);

		return <>{notificationsMarkup}</>;
	}
}

const mapStateToProps = (state) => {
	return {
		notifications: state.user.notifications,
		currentUser: state.user.currentUser,
	};
};

export default connect(mapStateToProps, { markNotificationsRead })(
	withStyles(styles)(AdminNotifications)
);
