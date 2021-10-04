import React, { Component } from 'react';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
// import SearchIcon from '@material-ui/icons/SearchOutlined';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import Grid from '@material-ui/core/Grid';

import Seek from '../components/Seek';
import Profile from '../components/Profile';
import SkeletonSeek from '../components/SkeletonSeek';
import Pagination from '../components/Pagination';
import Welcome from '../components/Welcome';

import { setEditedToFalse } from '../redux/actions/dataActions';
// import { filter } from 'compression';

const styles = {
	searchContainer: {
		display: 'flex',
		gap: 5,
		alignItems: 'center',
		marginBottom: 20,
		width: '90%',
		margin: 'auto',
		'@media (max-width: 520px)': {
			width: '100%',
		},
	},
	innerContainer: {
		width: '100%',
		height: 30,
		position: 'relative',
	},
	searchBar: {
		width: '100%',
		background: 'transparent',
		marginRight: 10,
		padding: 5,
		paddingRight: 55,
		border: 'none',
		borderBottom: '2px solid rgba(0, 0, 0, 0.2)',
		outline: 'none',
		'&:focus': {
			borderBottom: '2px solid #800080',
		},
	},
	clear: {
		cursor: 'pointer',
		position: 'absolute',
		right: 5,
		top: '50%',
		transform: 'translate(0, -60%)',
	},
	// search: {
	// 	cursor: 'pointer',
	// 	position: 'absolute',
	// 	right: 35,
	// 	top: '50%',
	// 	transform: 'translate(0, -60%)',
	// },
};
class home extends Component {
	state = {
		currentPage: 1,
		postsPerPage: 5,
		input: '',
		seeks: [],
	};

	componentDidUpdate(oldProps, oldState) {
		if (
			this.state.input === '' &&
			oldProps.data.seeks.length > this.state.seeks.length
		) {
			this.setState({
				...this.state,
				seeks: [...this.props.data.seeks],
			});
		}
	}

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

	clearSearch = () => {
		this.setState({
			...this.state,
			input: '',
		});
	};

	search = (update, value) => {
		const input = update ? value : this.state.input;
		const filteredSeeks = this.props.data.seeks.filter(
			(seek) =>
				seek.title.toLowerCase().includes(input.toLowerCase()) ||
				seek.body.toLowerCase().includes(input.toLowerCase())
		);

		return filteredSeeks;
	};

	// onSearch = () => {
	// 	this.props.data.edited && this.props.setEditedToFalse();
	// 	const filteredSeeks = this.search();
	// 	this.setState({ ...this.state, seeks: [...filteredSeeks] });
	// };

	render() {
		const {
			data: { loading },
			classes,
		} = this.props;
		const seeks =
			this.state.seeks.length <= 0 || this.props.data.edited
				? this.props.data.seeks
				: this.state.seeks;

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
						<Seek
							key={seek.id}
							seek={seek}
							clear={this.clearSearch}
							commentCount={seek.commentCount}
							highlight={
								this.search(false).length > 0 && this.state.input !== ''
									? this.state.input
									: undefined
							}
						/>
					))
				) : (
					seeks.map((seek) => (
						<Seek
							key={seek.id}
							seek={seek}
							clear={this.clearSearch}
							commentCount={seek.commentCount}
							highlight={
								this.search(false).length > 0 && this.state.input !== ''
									? this.state.input
									: undefined
							}
						/>
					))
				)
			) : (
				<Welcome />
			);
		return (
			<>
				<div className={classes.searchContainer}>
					<div className={classes.innerContainer}>
						<input
							type="text"
							placeholder="Search for keywords"
							className={classes.searchBar}
							onChange={(e) => {
								const filteredSeeks = this.search(true, e.target.value);
								this.props.data.edited && this.props.setEditedToFalse();

								this.setState({
									...this.state,
									input: e.target.value,
									seeks: [...filteredSeeks],
								});
							}}
							value={this.state.input}
						/>
						<CancelIcon
							className={classes.clear}
							color="primary"
							fontSize="small"
							onClick={() =>
								this.state.input !== '' &&
								this.setState({
									...this.state,
									input: '',
								})
							}
						/>
						{/* <SearchIcon
							className={classes.search}
							color="primary"
							fontSize="small"
							onClick={this.onSearch}
						/> */}
					</div>
				</div>

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
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		data: state.data,
	};
};

export default connect(mapStateToProps, { setEditedToFalse })(
	withStyles(styles)(home)
);
