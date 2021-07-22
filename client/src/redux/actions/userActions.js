import axios from 'axios';

import {
	USER_LOGGEDIN,
	USER_LOGGEDOUT,
	SET_USER,
	REMOVE_USER,
	LOADING_UI,
	SET_ERRORS,
	CLEAR_ERRORS,
	LOADING,
	UPLOAD_PHOTO,
	SET_NOTIFICATIONS,
	MARK_NOTIFICATIONS_READ,
} from '../types';

export const userLogin = (userData, history) => (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
	dispatch({
		type: LOADING_UI,
	});
	axios
		.post('/api/seekers/login', {
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
		.post('/api/seekers/signup', {
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
		.get('/api/seekers/logout')
		.then(() => {
			dispatch({ type: USER_LOGGEDOUT });
			dispatch({ type: REMOVE_USER });
		})
		.catch((err) => console.error(err));
};

export const uploadImage = (formData) => (dispatch) => {
	axios
		.patch('/api/seekers/', formData)
		.then((res) => {
			dispatch({
				type: UPLOAD_PHOTO,
				user: res.data.result._id,
				photo: res.data.result.photo,
			});
			dispatch({
				type: SET_USER,
				user: res.data.result,
			});
		})
		.catch((err) => console.error(err));
};

export const editUser = (userDetails) => (dispatch) => {
	dispatch({
		type: LOADING,
	});

	axios
		.patch('/api/seekers/', userDetails)
		.then((res) => {
			dispatch({
				type: SET_USER,
				user: userDetails,
			});
		})
		.catch((err) => {
			console.error(err);
			dispatch({
				type: LOADING,
			});
		});
};

export const setNotifications = () => (dispatch) => {
	axios
		.get('/api/seekers/notifications')
		.then((res) =>
			dispatch({ type: SET_NOTIFICATIONS, payload: res.data.data })
		)
		.catch((err) => console.error(err));

	setInterval(() => {
		axios
			.get('/api/seekers/notifications')
			.then((res) =>
				dispatch({ type: SET_NOTIFICATIONS, payload: res.data.data })
			)
			.catch((err) => console.error(err));
	}, 10000);
};

export const markNotificationsRead = () => (dispatch) => {
	dispatch({
		type: MARK_NOTIFICATIONS_READ,
	});
	axios.post('/api/seekers/notifications').catch((err) => console.error(err));
};

export const authCheck = () => (dispatch) => {
	axios
		.get('/api/seekers/authcheck')
		.then((res) => {
			if (res.data.user) {
				dispatch({
					type: LOADING,
				});
				dispatch({
					type: USER_LOGGEDIN,
				});
				dispatch({
					type: SET_USER,
					user: res.data.user,
				});
			}
		})
		.catch((err) => console.error('error: ', err.response));
};
