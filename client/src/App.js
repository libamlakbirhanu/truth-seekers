import React from 'react';
import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeUtil from './utils/theme';

import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import forgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyAccount from './pages/VerifyAccount';
import seek from './pages/seek';
import profile from './pages/profile';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageNotFound from './components/PageNotFound';
import { authCheck } from './redux/actions/userActions';
import { getSeeks } from './redux/actions/dataActions';
import './App.css';

const theme = createMuiTheme({ ...themeUtil });

function App(props) {
	props.authCheck();
	props.getSeeks();

	return (
		<MuiThemeProvider theme={theme}>
			<div className="App">
				<Router>
					{!window.location.pathname.endsWith('admin') ? <Navbar /> : null}
					<div className={!props.admin ? `container` : ''}>
						<Switch>
							<Route exact path="/" component={home} />
							<Route exact path="/login" component={login} />
							<Route exact path="/signup" component={signup} />
							<Route exact path="/seek/:id" component={seek} />
							<Route exact path="/seeker/:id" component={profile} />
							<Route exact path="/admin" component={Admin} />
							<Route exact path="/forgotpassword" component={forgotPassword} />
							<Route path="/resetpassword" component={ResetPassword} />
							<Route path="/verifyaccount" component={VerifyAccount} />
							<Route component={PageNotFound} />
						</Switch>
						{!window.location.pathname.endsWith('admin') && <Footer />}
					</div>
				</Router>
			</div>
		</MuiThemeProvider>
	);
}

const mapStateToProps = (state) => {
	return {
		admin: state.user.admin,
	};
};

export default connect(mapStateToProps, { authCheck, getSeeks })(App);
