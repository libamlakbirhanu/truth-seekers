import {
	USER_LOGGEDIN,
	USER_LOGGEDOUT,
	SET_USER,
	REMOVE_USER,
	LOADING,
	UPVOTE_SEEK,
	DOWNVOTE_SEEK,
	SET_NOTIFICATIONS,
	MARK_NOTIFICATIONS_READ,
	UPVOTE_COMMENT,
	DOWNVOTE_COMMENT,
} from '../types';

const initialState = {
	isAuthenticated: false,
	currentUser: {},
	notifications: [],
	loading: false,
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
				currentUser: { ...state.currentUser, ...action.user },
				loading: false,
			};
		case REMOVE_USER:
			return {
				...state,
				currentUser: null,
			};
		case LOADING:
			return {
				...state,
				loading: !state.loading,
			};
		case UPVOTE_SEEK:
			state.currentUser.likedSeeks.unshift(action.payload.id);
			state.currentUser.dislikedSeeks = state.currentUser.dislikedSeeks.filter(
				(el) => el !== action.payload.id
			);
			return {
				...state,
			};
		case DOWNVOTE_SEEK:
			state.currentUser.dislikedSeeks.unshift(action.payload.id);
			state.currentUser.likedSeeks = state.currentUser.likedSeeks.filter(
				(el) => el !== action.payload.id
			);
			return {
				...state,
			};
		case UPVOTE_COMMENT:
			state.currentUser.likedComments.unshift(action.payload._id);
			state.currentUser.dislikedComments =
				state.currentUser.dislikedComments.filter(
					(el) => el !== action.payload._id
				);
			return {
				...state,
			};
		case DOWNVOTE_COMMENT:
			state.currentUser.dislikedComments.unshift(action.payload._id);
			state.currentUser.likedComments = state.currentUser.likedComments.filter(
				(el) => el !== action.payload._id
			);
			return {
				...state,
			};
		case SET_NOTIFICATIONS:
			if (state.notifications !== action.payload.notifications) {
				state.notifications = [...action.payload.notifications];
				state.notifications.forEach((notification) => {
					notification.readBy &&
					notification.readBy.includes(state.currentUser._id)
						? (notification.read = true)
						: (notification.read = false);
				});
			}

			return {
				...state,
			};
		case MARK_NOTIFICATIONS_READ:
			state.notifications.forEach((notification) => {
				notification.read = true;
				notification.readBy.concat(state.currentUser._id);
			});

			return {
				...state,
			};
		default:
			return state;
	}
};

export default reducer;
