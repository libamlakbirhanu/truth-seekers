import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import Seek from '../components/Seek';
import Profile from '../components/Profile';
import SkeletonSeek from '../components/SkeletonSeek';
import Pagination from '../components/Pagination';
import Welcome from '../components/Welcome';

class home extends Component {
	state = {
		currentPage: 1,
		postsPerPage: 5,
	};

	paginate = (number) => {
		this.setState({
			...this.state,
			currentPage: number,
		});
	};

	next = (seeks) => {
		this.setState({
			...this.state,
			currentPage:
				Math.ceil(seeks.length / this.state.postsPerPage) >
				this.state.currentPage
					? this.state.currentPage + 1
					: this.state.currentPage,
		});
	};

	prev = (seeks) => {
		this.setState({
			...this.state,
			currentPage:
				this.state.currentPage !== 1
					? this.state.currentPage - 1
					: this.state.currentPage,
		});
	};

	render() {
		const {
			data: { seeks, loading },
		} = this.props;
		const indexOfLastPost =
			seeks.length >= this.state.postsPerPage
				? this.state.currentPage * this.state.postsPerPage
				: seeks.length;
		const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
		const currentPosts = seeks.slice(indexOfFirstPost, indexOfLastPost);
		const seekMarkup =
			loading && seeks.length > 0 ? (
				<>
					<SkeletonSeek />
					<SkeletonSeek />
				</>
			) : seeks.length > 0 ? (
				seeks.length > 5 ? (
					currentPosts.map((seek) => (
						<Seek key={seek.id} seek={seek} commentCount={seek.commentCount} />
					))
				) : (
					seeks.map((seek) => (
						<Seek key={seek.id} seek={seek} commentCount={seek.commentCount} />
					))
				)
			) : (
				<Welcome />
			);
		return (
			<Grid container spacing={2}>
				<Grid item sm={8} xs={12}>
					<div>{seekMarkup}</div>
					{seeks.length > 4 && (
						<Pagination
							postsPerPage={5}
							paginate={this.paginate}
							next={() => this.next(seeks)}
							prev={() => this.prev(seeks)}
						/>
					)}
				</Grid>
				<Grid item sm={4} xs={12}>
					<Profile />
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		data: state.data,
	};
};

export default connect(mapStateToProps)(home);
