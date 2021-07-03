import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import PostSeek from './PostSeek';

function Navbar({ classes, user: { isAuthenticated } }) {
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

						<Tooltip title="view notifications" placement="top">
							<IconButton
							// onClick={handleImageEdit}
							// className={classes.editIcon}
							>
								<NotificationsIcon />
							</IconButton>
						</Tooltip>
					</>
				) : (
					<>
						<Button color="inherit" component={Link} to="/login">
							login
						</Button>
						<Button color="inherit" component={Link} to="/">
							<HomeIcon />
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

export default connect(mapStoreToProps)(Navbar);
