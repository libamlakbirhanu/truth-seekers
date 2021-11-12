import React, { Component } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { setReports } from '../../redux/actions/userActions';

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
		this.props.setReports();
	}

	render() {
		const { classes, reports } = this.props;

		dayjs.extend(relativeTime);

		let reportsMarkup =
			reports && reports.length > 0 ? (
				reports.map((report) => {
					const time = dayjs(report.createdAt).fromNow();
					const docType = report.hasOwnProperty('seek') ? 'comment' : 'seek';

					return (
						<div key={report._id} className={classes.notificationBox}>
							<Typography color="primary" style={{ fontWeight: 'bold' }}>
								{`authorID(${report.targetSeeker})'s ${docType} has been reported because of`}
							</Typography>
							<Typography
								style={{
									color: 'rgba(0,0,0,.8)',
									fontWeight: 'bold',
									marginTop: 10,
								}}
								variant="body1"
							>
								{report.reason.toUpperCase()}
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

		return <>{reportsMarkup}</>;
	}
}

const mapStateToProps = (state) => {
	return {
		reports: state.user.reports,
		currentUser: state.user.currentUser,
	};
};

export default connect(mapStateToProps, { setReports })(
	withStyles(styles)(Flagged)
);
