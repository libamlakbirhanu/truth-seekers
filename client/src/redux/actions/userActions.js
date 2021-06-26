import axios from 'axios';

import {
	USER_LOGGEDIN,
	USER_LOGGEDOUT,
	SET_USER,
	REMOVE_USER,
	LOADING_UI,
	SET_ERRORS,
	CLEAR_ERRORS,
} from '../types';

export const userLogin = (userData, history) => (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
	dispatch({
		type: LOADING_UI,
	});
	axios
		.post('/seekers/login', {
			email: userData.email,
			password: userData.password,
		})
		.then((res) => {
			dispatch({
				type: USER_LOGGEDIN,
			});
			dispatch({
				type: LOADING_UI,
			});
			dispatch({
				type: SET_USER,
				user: res.data.data,
			});
			history.push('/');
		})
		.catch((err) => {
			dispatch({
				type: LOADING_UI,
			});
			dispatch({
				type: SET_ERRORS,
				error: err.response.data,
			});
			setTimeout(() => {
				dispatch({
					type: CLEAR_ERRORS,
				});
			}, 2500);
		});
};

export const userSignup = (userData, history) => (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
	dispatch({
		type: LOADING_UI,
	});
	axios
		.post('/seekers/signup', {
			email: userData.email,
			name: userData.name,
			password: userData.password,
			confirmPassword: userData.confirmPassword,
		})
		.then((res) => {
			dispatch({
				type: USER_LOGGEDIN,
			});
			dispatch({
				type: LOADING_UI,
			});
			dispatch({
				type: SET_USER,
				user: res.data.data,
			});
			history.push('/');
		})
		.catch((err) => {
			dispatch({
				type: LOADING_UI,
			});
			dispatch({
				type: SET_ERRORS,
				error: err.response.data,
			});
			setTimeout(() => {
				dispatch({
					type: CLEAR_ERRORS,
				});
			}, 2500);
		});
};

export const userLogout = (history) => (dispatch) => {
	axios
		.get('/seekers/logout')
		.then(() => {
			dispatch({ type: USER_LOGGEDOUT });
			dispatch({ type: REMOVE_USER });
			history.push('/');
		})
		.catch((err) => console.error(err));
};

export const authCheck = () => (dispatch) => {
	axios
		.get('/seekers/authcheck')
		.then((res) => {
			dispatch({
				type: USER_LOGGEDIN,
			});

			dispatch({
				type: SET_USER,
				user: res.data.user,
			});
		})
		.catch((err) => console.error(err));
};
