import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import Seek from '../components/Seek';
import Profile from '../components/Profile';
import { getSeeks } from '../redux/actions/dataActions';

class home extends Component {
	// componentDidMount() {
	// 	this.props.getSeeks();
	// }

	render() {
		const {
			user,
			data: { seeks, loading },
		} = this.props;
		const seekMarkup = !loading
			? seeks.map((seek) => <Seek key={seek.id} seek={seek} />)
			: 'content loading...';
		return (
			<Grid container spacing={2}>
				<Grid item sm={8} xs={12}>
					<div>{seekMarkup}</div>
				</Grid>
				<Grid item sm={3} xs={12}>
					<Profile
						currentUser={user.currentUser}
						isAuthenticated={user.isAuthenticated}
					/>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		data: state.data,
	};
};

export default connect(mapStateToProps, { getSeeks })(home);
