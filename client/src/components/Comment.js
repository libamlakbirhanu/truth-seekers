import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import Tooltip from '@material-ui/core/tooltip';
import IconButton from '@material-ui/core/IconButton';

import dayjs from 'dayjs';

import { connect } from 'react-redux';

const styles = {
	commentContainer: {
		display: 'flex',
	},
	innerContainer: {
		marginBottom: 25,
	},
	card: {
		maxWidth: '350px',
		marginBottom: 5,
	},
	weakColor: {
		color: 'rgba(0,0,0,.5)',
	},
	image: {
		width: '50px',
		height: '50px',
		borderRadius: '50%',
		marginRight: 10,
	},
	counts: {
		marginRight: 10,
		color: '#800080',
	},
	actionButtons: {
		paddingLeft: 10,
	},
};

export class Comment extends Component {
	likedComment = () => {
		if (
			this.props.user.currentUser &&
			this.props.user.currentUser.likedComments.length > 0 &&
			this.props.user.currentUser.likedComments.find(
				(id) => id === this.props.comment.id
			)
		)
			return true;
		else return false;
	};
	dislikedComment = () => {
		if (
			this.props.user.currentUser &&
			this.props.user.currentUser.dislikedComments.length > 0 &&
			this.props.user.currentUser.dislikedComments.find(
				(id) => id === this.props.comment.id
			)
		)
			return true;
		else return false;
	};

	render() {
		const {
			comment,
			classes,
			user: { isAuthenticated },
		} = this.props;

		const upvoteButton = !isAuthenticated ? (
			<Tooltip title="upvote" placement="top">
				<IconButton component={Link} to="/login">
					<ThumbUpOutlinedIcon color="primary" fontSize="small" />
				</IconButton>
			</Tooltip>
		) : !this.likedComment() ? (
			<Tooltip title="upvote" placement="top">
				<IconButton>
					<ThumbUpOutlinedIcon color="primary" fontSize="small" />
				</IconButton>
			</Tooltip>
		) : (
			<Tooltip title="upvote" placement="top">
				<IconButton>
					<ThumbUpIcon color="primary" fontSize="small" />
				</IconButton>
			</Tooltip>
		);

		const downvoteButton = !isAuthenticated ? (
			<Tooltip title="downvote" placement="top">
				<IconButton component={Link} to="/login">
					<ThumbDownOutlinedIcon color="primary" fontSize="small" />
				</IconButton>
			</Tooltip>
		) : !this.dislikedComment() ? (
			<Tooltip title="downvote" placement="top">
				<IconButton>
					<ThumbDownOutlinedIcon color="primary" fontSize="small" />
				</IconButton>
			</Tooltip>
		) : (
			<Tooltip title="downvote" placement="top">
				<IconButton>
					<ThumbDownIcon color="primary" fontSize="small" />
				</IconButton>
			</Tooltip>
		);

		return (
			<div className={classes.commentContainer}>
				<div>
					<img
						src={`http://localhost:5000/static/image/seekers/${comment.author.photo}`}
						alt="seeker"
						className={classes.image}
					/>
				</div>
				<div className={classes.innerContainer}>
					<Card className={classes.card}>
						<CardContent>
							<Typography variant="body2">{comment.body}</Typography>
						</CardContent>
						<div className={classes.actionButtons}>
							{upvoteButton}
							<span className={classes.counts}>{comment.upvotes}</span>
							{downvoteButton}
							<span className={classes.counts}>{comment.downvotes}</span>
						</div>
					</Card>
					<span className={classes.weakColor}>
						{dayjs(comment.createdAt).format('h:mm a, MMMM DD')}
					</span>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(Comment));
