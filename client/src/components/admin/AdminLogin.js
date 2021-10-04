import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { userLogin } from './../../redux/actions/userActions';
import logo from '../../assets/truthseekers.png';

const styles = (theme) => ({
	...theme.spreadIt,
});

class AdminLogin extends Component {
	constructor() {
		super();

		this.state = {
			email: '',
			password: '',
		};
	}
	handleSubmit = async (event) => {
		event.preventDefault();

		const { email, password } = this.state;
		this.props.userLogin({ email, password }, this.props.history, true);
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	render() {
		const { classes, UI } = this.props;

		return (
			<div className={classes.center}>
				<div className={classes.formContainer}>
					<img src={logo} title="LOGO" alt="LOGO" className={classes.image} />
					{UI.error && (
						<div className={classes.errorBox}>{UI.error.message}</div>
					)}
					<form onSubmit={this.handleSubmit} className={classes.form}>
						<TextField
							id="email"
							name="email"
							type="email"
							label="Email"
							className={classes.textField}
							value={this.state.email}
							onChange={this.handleChange}
							required
						></TextField>
						<TextField
							id="password"
							name="password"
							type="password"
							label="Password"
							className={classes.textField}
							value={this.state.password}
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
							login
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

AdminLogin.propTypes = {
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return { UI: state.UI };
};

const mapStateToDispatch = {
	userLogin,
};

export default connect(
	mapStateToProps,
	mapStateToDispatch
)(withStyles(styles)(AdminLogin));
