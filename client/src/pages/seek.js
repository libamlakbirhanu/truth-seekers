import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import { connect } from 'react-redux';
import {
	getSeek,
	clearSeek,
	createComment,
} from './../redux/actions/dataActions';

import Seek from './../components/Seek';
import Comment from './../components/Comment';
import SkeletonSeek from './../components/SkeletonSeek';

const styles = (theme) => ({
	...theme.spreadIt,
	container: {
		width: '70%',
		margin: 'auto',
	},
	comments: {
		marginTop: 80,
		marginBottom: 50,
	},
	postButton: {
		float: 'right',
		position: 'relative',
	},
	progressLoader: {
		position: 'absolute',
	},
});

export class seek extends Component {
	constructor(props) {
		super(props);
		this.state = {
			body: '',
		};
		this.myRef = React.createRef();
	}

	componentDidMount() {
		this.props.getSeek(this.props.match.params.id);
		window.scrollTo(0, this.myRef.current);
	}
	componentWillUnmount() {
		this.props.clearSeek();
	}

	onChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	handleSubmit = () => {
		const commentData = {
			seek: this.props.match.params.id,
			body: document.getElementById('commentBody').value,
		};
		this.props.createComment(commentData);
		this.setState({
			body: '',
		});
	};

	render() {
		const { classes, seek, isAuthenticated } = this.props;
		const isSeekEmpty = JSON.stringify(seek) === '{}' || !seek;

		return !isSeekEmpty ? (
			<div className="seekWidth">
				<div ref={this.myRef}>
					<Seek
						seek={seek}
						commentCount={seek.commentCount}
						fullContent={true}
					/>
				</div>

				{isAuthenticated && (
					<>
						<TextField
							name="body"
							type="text"
							label="comment"
							placeholder="write a comment"
							id="commentBody"
							multiline
							rows={3}
							className={classes.textField}
							value={this.state.body}
							onChange={this.onChange}
						/>
						<Button
							onClick={this.handleSubmit}
							variant="contained"
							color="primary"
							disabled={this.props.loading}
							className={classes.postButton}
						>
							{this.props.loading && (
								<CircularProgress
									size={30}
									className={classes.progressLoader}
								/>
							)}
							comment
						</Button>
					</>
				)}
				{seek.comments.length > 0 ? (
					<>
						<div className={classes.comments}>
							<Typography variant="h4" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
								Comments
							</Typography>
						</div>
						{seek.comments.map((comment) => (
							<Comment comment={comment} key={comment._id} />
						))}
					</>
				) : (
					<div className={classes.comments}>
						<Typography variant="h4" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
							~No comments~
						</Typography>
					</div>
				)}
			</div>
		) : (
			<>
				<div className="seekWidth">
					<SkeletonSeek />
				</div>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.UI.loading,
		seek: state.data.seek,
		isAuthenticated: state.user.isAuthenticated,
	};
};

export default connect(mapStateToProps, { getSeek, clearSeek, createComment })(
	withStyles(styles)(seek)
);
