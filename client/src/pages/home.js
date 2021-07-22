import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import Seek from '../components/Seek';
import Profile from '../components/Profile';
import SkeletonSeek from '../components/SkeletonSeek';

class home extends Component {
	render() {
		const {
			user,
			data: { seeks, loading },
		} = this.props;
		const seekMarkup =
			seeks.length > 0 ? (
				!loading ? (
					seeks.map((seek) => (
						<Seek key={seek.id} seek={seek} commentCount={seek.commentCount} />
					))
				) : (
					<>
						<SkeletonSeek />
						<SkeletonSeek />
					</>
				)
			) : null;
		return (
			<Grid container spacing={2}>
				<Grid item sm={8} xs={12}>
					<div>{seekMarkup}</div>
				</Grid>
				<Grid item sm={4} xs={12}>
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

export default connect(mapStateToProps)(home);
