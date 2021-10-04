import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Badge from '@material-ui/core/Badge';

import NotificationsIcon from '@material-ui/icons/Notifications';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import FlagIcon from '@material-ui/icons/Flag';

import AdminLogin from '../components/admin/AdminLogin';
import Notifications from '../components/admin/AdminNotifications';
import Flagged from '../components/admin/Flagged';
import Promote from '../components/admin/Promote';
import ChangePassword from '../components/admin/ChangePassword';

const styles = {
	adminPanel: {
		display: 'flex',
	},
	sidebarItem: {
		display: 'flex',
		alignItems: 'center',
		gap: 5,
		padding: '10px 10px',
		cursor: 'pointer',
	},
	active: {
		backgroundColor: '#1e0033',
	},
	sidebarText: {
		color: 'rgba(255,255,255,0.5)',
	},
};

const Admin = ({ classes, user }) => {
	const [active, setActive] = useState(
		user.currentUser.defaultCredentials ? 'change password' : 'notifications'
	);
	const [tabBarText, setTabBarText] = useState(true);

	useEffect(() => {
		if (window.innerWidth <= 800) setTabBarText(false);
	}, []);

	const toggleTabBarTexts = () => {
		if (window.innerWidth <= 800) setTabBarText(false);
		else setTabBarText(true);
	};

	window.addEventListener('resize', toggleTabBarTexts);

	const handleClick = (activeTab) => {
		setActive(activeTab);
	};
	let tab;

	const tabView = () => {
		switch (active) {
			case 'notifications':
				tab = <Notifications />;
				return tab;
			case 'promote':
				tab = <Promote />;
				return tab;
			case 'flagged':
				tab = <Flagged />;
				return tab;
			case 'change password':
				tab = <ChangePassword />;
				return tab;
			default:
				tab = <Notifications />;
				return tab;
		}
	};

	tabView();

	return user.currentUser && user.admin ? (
		<div className={classes.adminPanel}>
			<div className="sidebar">
				<div
					className={`${classes.sidebarItem} ${
						active === 'notifications' && classes.active
					}`}
					onClick={() => handleClick('notifications')}
				>
					<Badge color="secondary">
						<NotificationsIcon color="primary" fontSize="large" />
					</Badge>
					{tabBarText && <p className={classes.sidebarText}>Notifications</p>}
				</div>
				<div
					className={`${classes.sidebarItem} ${
						active === 'promote' && classes.active
					}`}
					onClick={() => handleClick('promote')}
				>
					<StarHalfIcon color="primary" fontSize="large" />
					{tabBarText && <p className={classes.sidebarText}>Promote</p>}
				</div>
				<div
					className={`${classes.sidebarItem} ${
						active === 'flagged' && classes.active
					}`}
					onClick={() => handleClick('flagged')}
				>
					<FlagIcon color="primary" fontSize="large" />
					{tabBarText && <p className={classes.sidebarText}>Flagged</p>}
				</div>
				<div
					className={`${classes.sidebarItem} ${
						active === 'change password' && classes.active
					}`}
					onClick={() => handleClick('change password')}
				>
					<KeyboardIcon color="primary" fontSize="large" />
					{tabBarText && <p className={classes.sidebarText}>Change Password</p>}
				</div>
			</div>
			<div className="tabs">
				<div className="tab">{tab}</div>
			</div>
		</div>
	) : (
		<AdminLogin admin />
	);
};

const mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Admin));
