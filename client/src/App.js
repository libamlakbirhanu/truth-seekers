import React from 'react';
import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeUtil from './utils/theme';

import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import seek from './pages/seek';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
					<Navbar />
					<div className="container">
						<Switch>
							<Route exact path="/" component={home} />
							<Route exact path="/login" component={login} />
							<Route exact path="/signup" component={signup} />
							<Route exact path="/seek/:id" component={seek} />
						</Switch>
						<Footer />
					</div>
				</Router>
			</div>
		</MuiThemeProvider>
	);
}

export default connect(null, { authCheck, getSeeks })(App);
