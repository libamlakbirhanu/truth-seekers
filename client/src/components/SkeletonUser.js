import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
	card: {
		padding: 10,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: '50%',
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	userName: {
		width: '25%',
		height: 5,
		borderRadius: 2,
		marginBottom: 5,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
	longText: {
		width: '80%',
		height: 20,
		borderRadius: 10,
		marginBottom: 10,
		backgroundColor: 'rgba(0,0,0,0.2)',
	},
	shortText: {
		width: '60%',
		height: 20,
		borderRadius: 10,
		marginBottom: 15,
		backgroundColor: 'rgba(0,0,0,0.15)',
	},
};

class SkeletonUser extends Component {
	render() {
		const { classes } = this.props;

		return (
			<>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginBottom: '20px',
					}}
				>
					<div className={classes.image}></div>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						flexWrap: 'wrap',
					}}
				>
					<div
						className={classes.userName}
						style={{ marginBottom: '25px' }}
					></div>
					<div className={classes.longText}></div>
					<div className={classes.shortText}></div>
				</div>
			</>
		);
	}
}

export default withStyles(styles)(SkeletonUser);
