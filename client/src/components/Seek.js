import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import ChatIcon from '@material-ui/icons/Chat';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import FlagIcon from '@material-ui/icons/Flag';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

import { connect } from 'react-redux';
import {
	upvoteSeek,
	downvoteSeek,
	deleteSeek,
	editSeek,
} from '../redux/actions/dataActions';

import Delete from './Delete';
import EditDetails from './EditDetails';

const styles = {
	card: {
		marginBottom: '20px',
		padding: 25,
		display: 'flex',
		flexWrap: 'wrap',
		position: 'relative',
	},
	expert: {
		backgroundColor: 'rgba(220, 178, 250, 0.5)',
	},
	title: {
		marginBottom: 10,
		fontWeight: 'bold',
		color: 'rgba(0,0,0,0.75)',
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: '50%',
	},
	content: {
		marginTop: 5,
		width: '100%',
		paddingLeft: 0,
	},
	counts: {
		marginRight: 10,
		color: '#800080',
	},
	expand: {
		marginBottom: '-5px',
	},
};

class Seek extends Component {
	likedSeek = () => {
		if (
			this.props.user.currentUser &&
			this.props.user.currentUser.likedSeeks.length > 0 &&
			this.props.user.currentUser.likedSeeks.find(
				(id) => id === this.props.seek.id
			)
		)
			return true;
		else return false;
	};
	dislikedSeek = () => {
		if (
			this.props.user.currentUser &&
			this.props.user.currentUser.dislikedSeeks.length > 0 &&
			this.props.user.currentUser.dislikedSeeks.find(
				(id) => id === this.props.seek.id
			)
		)
			return true;
		else return false;
	};

	goToComment = (seek, history) => {
		history.push(`/seek/${seek}`);
		this.props.user.isAuthenticated &&
			setTimeout(() => {
				document.getElementById('commentBody') &&
					document.getElementById('commentBody').focus();
			}, 500);
	};

	highlightedText = (text, target) => {
		const seekBody = text
			.toLowerCase()
			.split(new RegExp(`(${target.toLowerCase()})`, 'gi'));

		const highlighted = (
			<>
				{seekBody.map((part, index) =>
					part === target ? <mark key={index}>{part}</mark> : part
				)}
			</>
		);
		return highlighted;
	};

	render() {
		dayjs.extend(relativeTime);
		const {
			classes,
			seek,
			fullContent,
			upvoteSeek,
			downvoteSeek,
			editSeek,
			user: { isAuthenticated, currentUser },
		} = this.props;

		const upvoteButton = !isAuthenticated ? (
			<Tooltip title="upvote" placement="top">
				<IconButton component={Link} to="/login">
					<ThumbUpOutlinedIcon color="primary" fontSize="small" />
				</IconButton>
			</Tooltip>
		) : !this.likedSeek() ? (
			<Tooltip title="upvote" placement="top">
				<IconButton onClick={() => upvoteSeek(seek.id)}>
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
		) : !this.dislikedSeek() ? (
			<Tooltip title="downvote" placement="top">
				<IconButton onClick={() => downvoteSeek(seek.id)}>
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
			isAuthenticated && currentUser._id === seek.author._id ? (
				<Delete onclick={() => this.props.deleteSeek(seek.id)} target="seek" />
			) : null;

		const reportButton =
			currentUser._id !== seek.author._id ? (
				<Tooltip title="report" placement="top">
					<IconButton>
						<FlagIcon style={{ color: 'red' }} fontSize="small" />
					</IconButton>
				</Tooltip>
			) : null;

		const editButton =
			isAuthenticated && currentUser._id === seek.author._id ? (
				<EditDetails
					target={seek}
					clear={this.props.clear}
					details={{ firstTextField: 'title', secondTextField: 'body' }}
					edit={editSeek}
				/>
			) : null;

		const imageUrl = `/static/assets/image/seekers/${
			currentUser && currentUser._id === seek.author._id
				? currentUser.photo
				: seek.author.photo
		}`;

		const cardClass =
			seek.author.rank === 'expert'
				? `${classes.card} ${classes.expert}`
				: classes.card;

		return (
			<Card className={cardClass}>
				<Link to={{ pathname: imageUrl }} target="_blank">
					<CardMedia
						image={imageUrl}
						key={currentUser && currentUser.photo}
						title="profile image"
						className={classes.image}
					/>
				</Link>

				<CardContent className={classes.p25}>
					<Typography
						variant="h5"
						color="primary"
						component={Link}
						to={`/seeker/${seek.author._id}`}
					>
						{currentUser && currentUser._id === seek.author._id
							? `${currentUser.name[0].toUpperCase()}${currentUser.name.slice(
									1,
									currentUser.name.length
							  )}`
							: `${seek.author.name[0].toUpperCase()}${seek.author.name.slice(
									1,
									seek.author.name.length
							  )}`}
					</Typography>
					<Typography variant="body2" color="textSecondary">
						{dayjs(seek.createdAt).fromNow()}
					</Typography>
				</CardContent>
				<div>{editButton}</div>

				<CardContent className={classes.content}>
					<Typography variant="h5" className={classes.title}>
						{this.props.highlight
							? this.highlightedText(seek.title, this.props.highlight)
							: `${seek.title[0].toUpperCase()}${seek.title.slice(
									1,
									seek.title.length
							  )}`}
					</Typography>
					<Typography variant="body2">
						{fullContent || this.props.highlight ? (
							this.props.highlight ? (
								this.highlightedText(seek.body, this.props.highlight)
							) : (
								seek.body
							)
						) : seek.body.length > 205 ? (
							<>
								{seek.body.substring(0, 200).trim()}...
								<Link to={`/seek/${seek.id}`} title="expand seek">
									<UnfoldMoreIcon
										color="primary"
										fontSize="small"
										className={classes.expand}
									/>
								</Link>
							</>
						) : (
							seek.body
						)}
					</Typography>
				</CardContent>

				<div>
					{upvoteButton}
					<span className={classes.counts}>{seek.upvotes}</span>
					{downvoteButton}
					<span className={classes.counts}>{seek.downvotes}</span>
					<Tooltip
						title="comment"
						placement="top"
						onClick={() => this.goToComment(seek.id, this.props.history)}
					>
						<IconButton>
							<ChatIcon color="primary" fontSize="small" />
						</IconButton>
					</Tooltip>
					<span className={classes.counts}>{this.props.commentCount}</span>
					{deleteButton}
					{reportButton}
				</div>
			</Card>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};

export default connect(mapStateToProps, {
	upvoteSeek,
	downvoteSeek,
	deleteSeek,
	editSeek,
})(withRouter(withStyles(styles)(Seek)));
