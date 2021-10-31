import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { changeEmail } from '../../redux/actions/userActions';
import logo from '../../assets/truthseekers.png';

const styles = (theme) => ({
	...theme.spreadIt,
});

class ChangeEmail extends Component {
	constructor() {
		super();

		this.state = {
			email: '',
		};
	}
	handleSubmit = async (event) => {
		event.preventDefault();

		const { email } = this.state;
		this.props.changeEmail(email, this.props.history);
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	render() {
		const { classes, UI, email } = this.props;

		return (
			<div className={classes.center}>
				<div className={classes.formContainer}>
					<img src={logo} title="LOGO" alt="LOGO" className={classes.image} />
					{UI.error && (
						<div className={classes.errorBox}>{UI.error.message}</div>
					)}
					<form className={classes.form} onSubmit={this.handleSubmit}>
						<TextField
							id="email"
							name="email"
							type="email"
							label="Email"
							className={classes.textField}
							value={this.state.email}
							placeholder={email}
							onChange={this.handleChange}
							required
						></TextField>

						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={classes.button}
							disabled={UI.loading && true}
						>
							Change Default Email
							{UI.loading && (
								<CircularProgress
									className={classes.progress}
									size={25}
								></CircularProgress>
							)}
						</Button>
					</form>
				</div>
			</div>
		);
	}
}

ChangeEmail.propTypes = {
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return { UI: state.UI, email: state.user.currentUser.email };
};

const mapStateToDispatch = {
	changeEmail,
};

export default connect(
	mapStateToProps,
	mapStateToDispatch
)(withStyles(styles)(ChangeEmail));
