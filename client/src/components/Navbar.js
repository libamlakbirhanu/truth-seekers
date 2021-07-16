import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import PostSeek from './PostSeek';
import Notifications from './Notifications';
import { setNotifications } from './../redux/actions/userActions';

function Navbar({ setNotifications, classes, user: { isAuthenticated } }) {
	useEffect(() => {
		isAuthenticated && setNotifications();
	}, [setNotifications, isAuthenticated]);

	return (
		<AppBar>
			<Toolbar className="nav-container">
				{isAuthenticated ? (
					<>
						<PostSeek />
						<Link to="/">
							<Tooltip title="home" placement="top">
								<IconButton>
									<HomeIcon />
								</IconButton>
							</Tooltip>
						</Link>
						<Notifications />
					</>
				) : (
					<>
						<Button color="inherit" component={Link} to="/login">
							login
						</Button>
						<Button color="inherit" component={Link} to="/">
							home
						</Button>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
}

const mapStoreToProps = (state) => {
	return {
		user: state.user,
	};
};

export default connect(mapStoreToProps, { setNotifications })(Navbar);
