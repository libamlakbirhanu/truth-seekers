import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { getSeek, clearSeek } from './../redux/actions/dataActions';

import Seek from './../components/Seek';

const styles = {
	container: {
		width: '40%',
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
			<Seek seek={seek} fullContent={true} className={classes.container} />
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
