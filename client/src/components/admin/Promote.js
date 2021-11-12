import React, { Component } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { setPromotions } from '../../redux/actions/userActions';

const styles = {
	notificationBox: {
		backgroundColor: 'white',
		padding: 15,
		borderRadius: '5px',
		marginBottom: 15,
	},
};

class Flagged extends Component {
	componentDidMount() {
		this.props.setPromotions();
	}

	render() {
		const { classes, promotions } = this.props;

		dayjs.extend(relativeTime);

		let promotionsMarkup =
			promotions && promotions.length > 0 ? (
				promotions.map((promotion) => {
					const time = dayjs(promotion.createdAt).fromNow();

					return (
						<div key={promotion._id} className={classes.notificationBox}>
							<Typography color="primary" style={{ fontWeight: 'bold' }}>
								{`authorID(${promotion.targetSeeker}) is ${promotion.message}`}
							</Typography>
							<Typography
								style={{
									color: 'rgba(0,0,0,.8)',
									fontWeight: 'bold',
									marginTop: 10,
								}}
								variant="body1"
							>
								{/* {promotion.message.toUpperCase()} */}
								<span
									style={{ display: 'block', fontSize: '12px' }}
									className="weakColor"
								>{` ${time}`}</span>
							</Typography>
						</div>
					);
				})
			) : (
				<div className={classes.notificationBox}>
					<Typography variant="body1" color="primary">
						Nothing to show
					</Typography>
				</div>
			);

		return <>{promotionsMarkup}</>;
	}
}

const mapStateToProps = (state) => {
	return {
		promotions: state.user.promotions,
		currentUser: state.user.currentUser,
	};
};

export default connect(mapStateToProps, { setPromotions })(
	withStyles(styles)(Flagged)
);
