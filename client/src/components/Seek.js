import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// import userImage from `${seek.photo}`;

const styles = {
	card: {
		marginBottom: '20px',
		padding: 25,
		display: 'flex',
		flexWrap: 'wrap',
	},
	title: {
		marginBottom: 15,
		fontWeight: 'bold',
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: '50%',
	},
	content: {
		marginTop: 20,
		width: '100%',
		paddingLeft: 0,
	},
};

class Seek extends Component {
	render() {
		dayjs.extend(relativeTime);
		const { classes, seek } = this.props;

		return (
			<Card className={classes.card}>
				<CardMedia
					image={`http://localhost:5000/static/image/seekers/${seek.author.photo}`}
					title="profile image"
					className={classes.image}
				/>
				<CardContent className={classes.p25}>
					<Typography
						variant="h5"
						component={Link}
						to={`/seekers/${seek.author._id}`}
						color="primary"
					>
						{`${seek.author.name[0].toUpperCase()}${seek.author.name.slice(
							1,
							seek.author.name.length
						)}`}
					</Typography>
					<Typography variant="body2" color="textSecondary">
						{dayjs(seek.createdAt).fromNow()}
					</Typography>
				</CardContent>
				<CardContent className={classes.content}>
					<Typography variant="h5" className={classes.title}>
						{seek.title}
					</Typography>
					<Typography variant="body2">{seek.body}</Typography>
				</CardContent>
			</Card>
		);
	}
}

export default withStyles(styles)(Seek);
