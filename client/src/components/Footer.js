import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import logo from './../assets/footer.png';

const styles = {
	footerText: {
		color: 'rgba(255,255,255,0.7)',
		textAlign: 'center',
		fontSize: 12,
	},
	footerHeader: {
		color: 'rgba(255,255,255,0.8)',
		textAlign: 'center',
		fontWeight: 'bold',
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 10,
		paddingTop: 20,
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
			<Card className="footerContainer">
				<CardMedia
					image={logo}
					title="LOGO"
					className={classes.image}
					id="footerLogo"
				/>
				<CardContent className={classes.content} id="footerNews">
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
