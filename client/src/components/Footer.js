import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import logo from './../assets/logo-dark.png';

const styles = {
	cardContainer: {
		padding: '25px 0',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginBottom: 50,
		marginTop: 100,
		backgroundColor: '#800080',
		borderRadius: 20,
		boxShadow: '5px 5px 10px',
	},
	footerText: {
		color: '#F2F2F2',
		textAlign: 'center',
		fontSize: 14,
	},
	footerHeader: {
		color: '#F2F2F2',
		textAlign: 'center',
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: '50%',
		boxShadow: '5px 5px 15px',
	},
	content: {
		width: '300px',
	},
};

class Footer extends Component {
	render() {
		const { classes } = this.props;

		return (
			<Card className={classes.cardContainer}>
				<CardMedia image={logo} title="LOGO" className={classes.image} />
				<CardContent className={classes.content}>
					<Typography variant="h4" className={classes.footerHeader}>
						Newsletter
					</Typography>
					<br />
					<Typography variant="body1" className={classes.footerText}>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, dolor sit
						amet, consectetur.
					</Typography>
				</CardContent>
				<CardContent>
					<Typography variant="h4" className={classes.footerHeader}>
						Footer
					</Typography>
				</CardContent>
			</Card>
		);
	}
}

export default withStyles(styles)(Footer);
