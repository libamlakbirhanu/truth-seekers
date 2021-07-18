import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import NotificationsIcon from '@material-ui/icons/Notifications';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

import { connect } from 'react-redux';
import { markNotificationsRead } from '../redux/actions/userActions';

class Notifications extends Component {
	state = {
		anchorEl: null,
	};

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
		const notifications = this.props.notifications;
		const anchorEl = this.state.anchorEl;

		dayjs.extend(relativeTime);

		const unreadNotifications = notifications.filter(
			(notification) => !notification.read
		);

		let notificationsMarkup =
			notifications && notifications.length > 0 ? (
				notifications.map((not) => {
					const time = dayjs(not.createdAt).fromNow();
					const classes = !not.read ? 'unread' : '';

					return (
						<MenuItem
							key={not._id}
							onClick={this.handleClose}
							className={classes}
						>
							<Typography
								component={Link}
								to={`/seek/${not.targetDocument}`}
								color="primary"
								variant="body1"
								noWrap={true}
							>
								{not.message}
								<span
									style={{ display: 'block', fontSize: '12px' }}
									className="weakColor"
								>{` ${time}`}</span>
							</Typography>
						</MenuItem>
					);
				})
			) : (
				<MenuItem onClick={this.handleClose}>
					<Typography variant="body1" color="primary">
						you have no notifications yet
					</Typography>
				</MenuItem>
			);

		return (
			<MenuItem>
				<Tooltip placement="top" title="notifications">
					<IconButton
						aria-owns={anchorEl ? 'simple-menu' : undefined}
						aria-haspopup="true"
						onClick={this.handleOpen}
					>
						<Badge badgeContent={unreadNotifications.length} color="secondary">
							<NotificationsIcon />
						</Badge>
					</IconButton>
				</Tooltip>
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={this.handleClose}
					onEntered={this.onMenuOpened}
				>
					{notificationsMarkup}
				</Menu>
			</MenuItem>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		notifications: state.user.notifications,
		currentUser: state.user.currentUser,
	};
};

export default connect(mapStateToProps, { markNotificationsRead })(
	Notifications
);
