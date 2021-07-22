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

import Seek from '../components/Seek';
import SkeletonSeek from '../components/SkeletonSeek';
import SkeletonUser from '../components/SkeletonUser';
import axios from 'axios';

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
	sizedBox: {
		width: 10,
		margin: 0,
	},
};

class profile extends Component {
	state = {
		userLoading: true,
		targetUser: null,
	};

	componentDidMount() {
		axios.get(`api/seekers/${this.props.match.params.id}`).then((res) => {
			this.setState({
				userLoading: false,
				targetUser: res.data.result,
			});
		});
	}

	render() {
		const {
			classes,
			data: { seeks, loading },
		} = this.props;
		const { targetUser, userLoading } = this.state;
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
				<Grid item sm={8} xs={12}>
					<div>{seekMarkup}</div>
				</Grid>
				<Grid item sm={3} xs={12}>
					{!userLoading ? (
						<Card className={classes.card}>
							<CardMedia
								className={classes.image}
								image={`https://seekers-of-the-truth.herokuapp.com/static/image/seekers/${targetUser.photo}`}
								key={targetUser.photo}
							/>
							<div className={classes.userContent}>
								<Typography>{targetUser.name}</Typography>
							</div>
							<div className={classes.userContent}>
								<EmailIcon color="primary" fontSize="small" />
								<div className={classes.sizedBox}></div>
								<span>{targetUser.email}</span>
							</div>
							<div className={classes.userContent}>
								<CalendarToday color="primary" fontSize="small" />
								<div className={classes.sizedBox}></div>
								<span>{`Joined ${dayjs(targetUser.date).format(
									'MMM YYYY'
								)}`}</span>
							</div>
						</Card>
					) : (
						<SkeletonUser />
					)}
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

export default connect(mapStateToProps)(withStyles(styles)(profile));
