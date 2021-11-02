import axios from 'axios';

import {
	USER_LOGGEDIN,
	USER_LOGGEDOUT,
	SET_USER,
	REMOVE_USER,
	LOADING_UI,
	SET_ERRORS,
	SET_SUCCESS,
	CLEAR_SUCCESS,
	CLEAR_ERRORS,
	LOADING,
	UPLOAD_PHOTO,
	SET_NOTIFICATIONS,
	MARK_NOTIFICATIONS_READ,
} from '../types';

export const userLogin = (userData, history, admin) => (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
	dispatch({
		type: LOADING_UI,
	});
	axios
		.post(admin ? '/api/admins/login' : '/api/seekers/login', {
			email: userData.email,
			password: userData.password,
		})
		.then((res) => {
			dispatch({
				type: USER_LOGGEDIN,
				user: res.data.data,
			});
			dispatch({
				type: LOADING_UI,
			});
			dispatch({
				type: SET_USER,
				user: res.data.data,
			});
			!admin && history.push('/');
		})
		.catch((err) => {
			console.log(err);
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

export const verifyAccount = (token, history, admin) => (dispatch) => {
	axios
		.post(
			admin ? `/api/admins/verify/${token}` : `/api/seekers/verify/${token}`
		)
		.then((res) => {
			dispatch({
				type: USER_LOGGEDIN,
				user: res.data.data,
			});
			dispatch({
				type: SET_USER,
				user: res.data.data,
			});
			admin ? history.push('/admin') : history.push('/');
		})
		.catch((err) => {
			setTimeout(() => history.push('/signup'), 1500);
			history.push('/signup');
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
				type: LOADING_UI,
			});
			history.push('/verifyaccount');
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

export const updatePassword = (passwords, history, admin) => (dispatch) => {
	dispatch({
		type: CLEAR_ERRORS,
	});
	dispatch({
		type: LOADING_UI,
	});
	axios
		.patch(
			admin ? '/api/admins/update-password' : '/api/seekers/update-password',
			passwords
		)
		.then(() => {
			!admin && dispatch({ type: USER_LOGGEDOUT });
			dispatch({
				type: SET_SUCCESS,
				message:
					'password updated successfully, you will be redirected to the login page',
			});
			dispatch({
				type: LOADING_UI,
			});
			setTimeout(() => {
				dispatch({ type: REMOVE_USER });
				dispatch({
					type: CLEAR_SUCCESS,
				});
			}, 1500);
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
			}, 1500);
		});
};

export const changeEmail = (email, history) => (dispatch) => {
	dispatch({
		type: LOADING_UI,
	});

	axios
		.patch('/api/admins/change-email', { email })
		.then((res) => {
			dispatch({
				type: LOADING_UI,
			});
			history.push('/admin');
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

export const forgetPass = (email, history) => (dispatch) => {
	dispatch({
		type: LOADING_UI,
	});

	axios
		.post('/api/seekers/forgot-password', { email })
		.then((res) => {
			dispatch({
				type: LOADING_UI,
			});
			history.push('/resetpassword');
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

export const resetPass = (token, newPass, history) => (dispatch) => {
	dispatch({
		type: LOADING_UI,
	});
	axios
		.patch(`/api/seekers/reset-password/${token}`, newPass)
		.then((res) => {
			dispatch({
				type: USER_LOGGEDIN,
				user: res.data.data,
			});
			dispatch({
				type: LOADING_UI,
			});
			dispatch({
				type: SET_USER,
				user: res.data.data,
			});
			setTimeout(() => {
				history.push('/');
			}, 500);
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
				history.push('/login');
			}, 5000);
		});
};

export const deactivate = (history) => (dispatch) => {
	axios.delete(`/api/seekers/`).then(() => {
		dispatch({ type: USER_LOGGEDOUT });
		dispatch({ type: REMOVE_USER });

		history.push('/');
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
	}, 5000);
};

export const markNotificationsRead = () => (dispatch) => {
	dispatch({
		type: MARK_NOTIFICATIONS_READ,
	});
	axios.post('/api/seekers/notifications').catch((err) => console.error(err));
};

export const authCheck = (admin) => (dispatch) => {
	axios
		.get('/api/seekers/authcheck')
		.then((res) => {
			if (res.data.user) {
				dispatch({
					type: LOADING,
				});
				dispatch({
					type: USER_LOGGEDIN,
					user: res.data.user,
				});
				dispatch({
					type: SET_USER,
					user: res.data.user,
				});
			}
		})
		.catch((err) => {
			axios
				.get('/api/admins/authcheck')
				.then((res) => {
					if (res.data.user) {
						dispatch({
							type: USER_LOGGEDIN,
							user: res.data.user,
						});
						dispatch({
							type: SET_USER,
							user: res.data.user,
						});
					}
				})
				.catch((err) => {});
		});
};
