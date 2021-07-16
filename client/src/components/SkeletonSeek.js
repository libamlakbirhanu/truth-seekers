import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';

const styles = {
	card: {
		padding: 25,
		marginBottom: 20,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: '50%',
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	short: {
		width: 100,
		height: 25,
		marginBottom: 10,
		borderRadius: 10,
		backgroundColor: 'rgba(0,0,0,0.2)',
	},
	veryShort: {
		width: 75,
		height: 25,
		borderRadius: 10,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
	longText: {
		width: '100%',
		height: 20,
		borderRadius: 10,
		marginBottom: 10,
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	shortText: {
		width: '25%',
		height: 20,
		borderRadius: 10,
		marginBottom: 15,
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
};

class SkeletonSeek extends Component {
	render() {
		const { classes } = this.props;

		return (
			<Card className={classes.card}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						marginBottom: '35px',
					}}
				>
					<div className={classes.image}></div>
					<div style={{ paddingLeft: '10px' }}>
						<div className={classes.short}></div>
						<div className={classes.veryShort}></div>
					</div>
				</div>
				<div className={classes.short} style={{ marginBottom: '25px' }}></div>
				<div className={classes.longText}></div>
				<div className={classes.longText}></div>
				<div className={classes.shortText}></div>
			</Card>
		);
	}
}

export default withStyles(styles)(SkeletonSeek);
