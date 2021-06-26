import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

function Navbar({ user: { isAuthenticated } }) {
	// eslint-disable-next-line react-hooks/exhaustive-deps

	return (
		<AppBar>
			<Toolbar className="nav-container">
				{isAuthenticated ? (
					<Button color="inherit" component={Link} to="/logout">
						logout
					</Button>
				) : (
					<Button color="inherit" component={Link} to="/login">
						login
					</Button>
				)}

				<Button color="inherit" component={Link} to="/">
					home
				</Button>
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
