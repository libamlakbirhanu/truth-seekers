import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { userSignup } from '../redux/actions/userActions';

import logo from '../assets/logo-dark.png';

const styles = (theme) => ({
	...theme.spreadIt,
});

class signup extends Component {
	constructor() {
		super();

		this.state = {
			email: '',
			name: '',
			password: '',
			confirmPassword: '',
		};
	}
	handleSubmit = async (event) => {
		event.preventDefault();
		const userData = {
			...this.state,
		};
		this.props.userSignup(userData, this.props.history);
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	render() {
		const { classes, UI } = this.props;
		console.log(UI);

		return (
			<div className={classes.center}>
				<div className={classes.formContainer}>
					<img src={logo} title="LOGO" alt="LOGO" className={classes.image} />
					<Typography variant="h2" className={classes.block}>
						Signup
					</Typography>
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
							id="name"
							name="name"
							type="text"
							label="Name"
							className={classes.textField}
							value={this.state.name}
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
						<TextField
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							label="Confirm Password"
							className={classes.textField}
							value={this.state.confirmPassword}
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
							signup
							{UI.loading && (
								<CircularProgress
									className={classes.progress}
									size={25}
								></CircularProgress>
							)}
						</Button>
						<small style={{ display: 'block', marginTop: 10 }}>
							Already have an account? <Link to="/login">Login</Link>
						</small>
					</form>
				</div>
			</div>
		);
	}
}

signup.propTypes = {
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return { UI: state.UI };
};

const mapStateToDispatch = {
	userSignup,
};

export default connect(
	mapStateToProps,
	mapStateToDispatch
)(withStyles(styles)(signup));
