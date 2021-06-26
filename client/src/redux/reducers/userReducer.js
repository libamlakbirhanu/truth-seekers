import { USER_LOGGEDIN, USER_LOGGEDOUT, SET_USER, REMOVE_USER } from '../types';

const initialState = {
	isAuthenticated: false,
	currentUser: {},
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case USER_LOGGEDOUT:
			return {
				...state,
				isAuthenticated: false,
			};

		case USER_LOGGEDIN:
			return {
				...state,
				isAuthenticated: true,
			};
		case SET_USER:
			return {
				...state,
				currentUser: action.user,
			};
		case REMOVE_USER:
			return {
				...state,
				currentUser: null,
			};
		default:
			return state;
	}
};

export default reducer;
