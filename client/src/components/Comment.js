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

import Delete from './Delete';
import EditComment from './EditComment';
import {
	deleteComment,
	upvoteComment,
	downvoteComment,
	editComment,
} from './../redux/actions/dataActions';

const styles = {
	commentContainer: {
		display: 'flex',
	},
	card: {
		maxWidth: '350px',
		marginBottom: 5,
		position: 'relative',
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
		paddingBottom: 5,
	},
};

export class Comment extends Component {
	likedComment = () => {
		if (
			this.props.user.currentUser &&
			this.props.user.currentUser.likedComments.length > 0 &&
			this.props.user.currentUser.likedComments.find(
				(id) => id === this.props.comment._id
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
				(id) => id === this.props.comment._id
			)
		)
			return true;
		else return false;
	};

	render() {
		const {
			comment,
			classes,
			upvoteComment,
			downvoteComment,
			editComment,
			user: { isAuthenticated, currentUser },
		} = this.props;

		const upvoteButton = !isAuthenticated ? (
			<Tooltip title="upvote" placement="top">
				<IconButton component={Link} to="/login">
					<ThumbUpOutlinedIcon color="primary" fontSize="small" />
				</IconButton>
			</Tooltip>
		) : !this.likedComment() ? (
			<Tooltip title="upvote" placement="top">
				<IconButton onClick={() => upvoteComment(comment._id)}>
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
				<IconButton onClick={() => downvoteComment(comment._id)}>
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
		const deleteButton =
			isAuthenticated && currentUser._id === comment.author._id ? (
				<Delete
					onclick={() => this.props.deleteComment(comment._id)}
					target="comment"
				/>
			) : null;

		return (
			<div className={classes.commentContainer}>
				<div>
					<img
						src={`https://seekers-of-the-truth.herokuapp.com/static/image/seekers/${comment.author.photo}`}
						alt="seeker"
						className={classes.image}
					/>
				</div>
				<div>
					<Card className={classes.card}>
						{isAuthenticated && (
							<div style={{ position: 'absolute', right: 5, marginTop: 5 }}>
								<EditComment
									comment={comment}
									userId={currentUser._id}
									edit={editComment}
								/>
							</div>
						)}
						<CardContent
							style={{
								paddingRight:
									isAuthenticated && currentUser._id === comment.author._id
										? 50
										: 5,
								paddingBottom: 10,
							}}
						>
							<Typography variant="body2">{comment.body}</Typography>
						</CardContent>

						<div className={classes.actionButtons}>
							{upvoteButton}
							<span className={classes.counts}>{comment.upvotes}</span>
							{downvoteButton}
							<span className={classes.counts}>{comment.downvotes}</span>
							{deleteButton}
						</div>
					</Card>
					<span className="weakColor">
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

export default connect(mapStateToProps, {
	deleteComment,
	upvoteComment,
	downvoteComment,
	editComment,
})(withStyles(styles)(Comment));
