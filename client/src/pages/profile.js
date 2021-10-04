import React, { Component } from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import EmailIcon from '@material-ui/icons/Email';
import CalendarToday from '@material-ui/icons/CalendarToday';
import StarIcon from '@material-ui/icons/Star';

import Seek from '../components/Seek';
import SkeletonSeek from '../components/SkeletonSeek';
import SkeletonUser from '../components/SkeletonUser';
import Settings from '../components/Settings';

import axios from 'axios';

import no_content from '../assets/no_content.png';

const styles = {
	card: {
		padding: '10px 5px',
		position: 'relative',
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: '50%',
		textAlign: 'center',
		margin: '0px auto 20px',
	},
	userContent: {
		padding: '0px',
		marginBottom: 10,
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	rank: {
		fontSize: '20px !important',
		color: '#800080',
	},
	sizedBox: {
		width: 10,
		margin: 0,
	},
	tab: {
		width: '50%',
		borderBottom: '2px solid rgba(0,0,0,.1)',
		display: 'flex',
		alignItems: 'center',
		padding: 10,
		paddingLeft: 20,
		cursor: 'pointer',
	},
	active: {
		borderBottom: '2px solid #800080',
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
	},
	innerContainer: {
		display: 'flex',
		marginBottom: 20,
	},
	noSeeks: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
	},
	noContent: {
		width: 300,
		height: 300,
	},
};

class profile extends Component {
	state = {
		userLoading: true,
		targetUser: null,
		settings: false,
	};

	componentDidMount() {
		axios
			.get(`/api/seekers/${this.props.match.params.id}`)
			.then((res) => {
				this.setState({
					userLoading: false,
					targetUser: res.data.result,
				});
			})
			.catch((err) => console.error(err.response));
	}

	handleSeekTabClick = () => {
		this.setState({
			...this.state,
			settings: false,
		});
	};
	handleSettingTabClick = () => {
		this.setState({
			...this.state,
			settings: true,
		});
	};

	render() {
		const {
			classes,
			data: { seeks, loading },
			id,
		} = this.props;
		const { targetUser, userLoading, settings } = this.state;
		const seekerPosts =
			!loading &&
			seeks.filter((seek) => seek.author._id === this.props.match.params.id);
		const profileMarkup = !userLoading ? (
			<Card className={classes.card}>
				<CardMedia
					className={classes.image}
					image={`/static/assets/image/seekers/${targetUser.photo}`}
					key={targetUser.photo}
				/>
				<div className={classes.userContent}>
					<Typography>{targetUser.name}</Typography>
				</div>
				<div className={classes.userContent}>
					<Typography className={classes.rank}>{targetUser.rank}</Typography>{' '}
					<StarIcon style={{ color: 'yellow' }} />
				</div>
				<div className={classes.userContent}>
					<EmailIcon color="primary" fontSize="small" />
					<div className={classes.sizedBox}></div>
					<span>{targetUser.email}</span>
				</div>
				<div className={classes.userContent}>
					<CalendarToday color="primary" fontSize="small" />
					<div className={classes.sizedBox}></div>
					<span>{`Joined ${dayjs(targetUser.date).format('MMM YYYY')}`}</span>
				</div>
			</Card>
		) : (
			<SkeletonUser />
		);
		const seekMarkup = !loading ? (
			seeks
				.filter((seek) => seek.author._id === this.props.match.params.id)
				.map((seek) => (
					<Seek key={seek.id} seek={seek} commentCount={seek.commentCount} />
				))
		) : (
			<>
				<SkeletonSeek />
				<SkeletonSeek />
			</>
		);

		return (
			<Grid container spacing={2}>
				<Grid item sm={8} xs={12} className={classes.container}>
					<div className={classes.innerContainer}>
						<div
							className={`${classes.tab} ${!settings && classes.active}`}
							onClick={this.handleSeekTabClick}
						>
							<Typography
								variant="h6"
								style={{ color: !settings && '#800080', fontWeight: 'bold' }}
							>
								Seeks
							</Typography>
						</div>
						{id === this.props.match.params.id && (
							<div
								className={`${classes.tab} ${settings && classes.active}`}
								onClick={this.handleSettingTabClick}
							>
								<Typography
									variant="h6"
									style={{ color: settings && '#800080', fontWeight: 'bold' }}
								>
									Settings
								</Typography>
							</div>
						)}
					</div>
					{!settings ? (
						seekerPosts.length > 0 ? (
							<div>{seekMarkup}</div>
						) : (
							<div className={classes.noSeeks}>
								<img
									src={no_content}
									alt="no content"
									className={classes.noContent}
									style={{ marginBottom: 20 }}
								/>
								<Typography
									variant="h2"
									style={{
										color: '#800080',
										fontWeight: 'bold',
										textAlign: 'center',
									}}
									id="noSeeks"
								>
									No seeks
								</Typography>
							</div>
						)
					) : (
						<Settings />
					)}
				</Grid>
				<Grid item sm={4} xs={12}>
					{profileMarkup}
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		data: state.data,
		id: state.user.currentUser && state.user.currentUser._id,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(profile));
