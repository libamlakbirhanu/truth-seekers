import React from 'react';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import withStyles from '@material-ui/core/styles/withStyles';
import CardMedia from '@material-ui/core/CardMedia';

import { connect } from 'react-redux';

import welcome from '../assets/welcome.jpg';

const styles = {
	card: {
		marginBottom: '20px',
		padding: 25,
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	content: {
		width: '100%',
		paddingLeft: 0,
		textAlign: 'center',
	},
	image: {
		width: 300,
		height: 150,
	},
};

const Welcome = ({ classes, isAuthenticated }) => {
	return (
		<Card className={classes.card}>
			<CardMedia image={welcome} title="welcome" className={classes.image} />
			<CardContent className={classes.content}>
				<Typography variant="h6">
					Welcome to truth seekers. This is a platform where people with
					different backgrounds raise religious questions and get comments from
					other people.{' '}
					{isAuthenticated &&
						"create seeks by clicking on the '+' icon on the AppBar"}
				</Typography>
			</CardContent>
			{!isAuthenticated && (
				<Button
					variant="contained"
					color="primary"
					component={Link}
					to="/login"
				>
					get started
				</Button>
			)}
		</Card>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.user.isAuthenticated,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Welcome));
