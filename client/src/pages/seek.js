import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { getSeek, clearSeek } from './../redux/actions/dataActions';

import Seek from './../components/Seek';
import Comment from './../components/Comment';

const styles = {
	container: {
		width: '70%',
		margin: 'auto',
	},
	comments: {
		marginTop: 80,
		marginBottom: 50,
	},
};

export class seek extends Component {
	componentDidMount() {
		this.props.getSeek(this.props.match.params.id);
	}
	componentWillUnmount() {
		this.props.clearSeek();
	}

	render() {
		const { classes, seek } = this.props;
		const isSeekEmpty = JSON.stringify(seek) === '{}' || !seek;

		return !isSeekEmpty ? (
			<div className={classes.container}>
				<Seek seek={seek} fullContent={true} />
				{seek.comments.length > 0 ? (
					<>
						<div className={classes.comments}>
							<Typography variant="h4">Comments</Typography>
						</div>
						{seek.comments.map((comment) => (
							<Comment comment={comment} />
						))}
					</>
				) : (
					<div className={classes.comments}>
						<Typography variant="h4">No comments</Typography>
					</div>
				)}
			</div>
		) : (
			'Content loading...'
		);
	}
}

const mapStateToProps = (state) => {
	return {
		seek: state.data.seek,
	};
};

export default connect(mapStateToProps, { getSeek, clearSeek })(
	withStyles(styles)(seek)
);
