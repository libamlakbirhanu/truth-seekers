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
	REPORT,
	SET_REPORTS,
} from '../types';

const promote = (state) => {
	state.currentUser.points++;
	if (state.currentUser.points >= 150) {
		state.currentUser.rank = 'shaman';
	} else if (state.currentUser.points >= 50) {
		state.currentUser.rank = 'apprentice';
	}
};

const demote = (state) => {
	state.currentUser.points--;
	if (
		(state.currentUser.rank =
			'apprentice' && state.currentUser.points < 50 - 10)
	) {
		state.currentUser.rank = 'user';
	} else if (
		(state.currentUser.rank = 'shaman' && state.currentUser.points < 150 - 10)
	) {
		state.currentUser.rank = 'apprentice';
	} else if (
		(state.currentUser.rank = 'expert' && state.currentUser.points < 500 - 10)
	) {
		state.currentUser.rank = 'shaman';
	}
};

const initialState = {
	isAuthenticated: false,
	currentUser: null,
	admin: false,
	notifications: [],
	reports: [],
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
				isAuthenticated: !(action.user.rank === 'admin'),
			};
		case SET_USER:
			return {
				...state,
				currentUser: { ...state.currentUser, ...action.user },
				loading: false,
				admin: action.user.rank === 'admin',
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
			const seekFromPayload = { ...action.payload };

			if (seekFromPayload.author._id === state.currentUser._id) {
				promote(state);
			}

			return {
				...state,
			};
		case DOWNVOTE_SEEK:
			state.currentUser.dislikedSeeks.unshift(action.payload.id);
			state.currentUser.likedSeeks = state.currentUser.likedSeeks.filter(
				(el) => el !== action.payload.id
			);
			const seekFromPayload2 = { ...action.payload };

			if (seekFromPayload2.author._id === state.currentUser._id) {
				demote(state);
			}

			return {
				...state,
			};
		case UPVOTE_COMMENT:
			state.currentUser.likedComments.unshift(action.payload._id);
			state.currentUser.dislikedComments =
				state.currentUser.dislikedComments.filter(
					(el) => el !== action.payload._id
				);
			const commentFromPayload = { ...action.payload };

			if (commentFromPayload.author === state.currentUser._id) {
				promote(state);
			}

			return {
				...state,
			};
		case DOWNVOTE_COMMENT:
			state.currentUser.dislikedComments.unshift(action.payload._id);
			state.currentUser.likedComments = state.currentUser.likedComments.filter(
				(el) => el !== action.payload._id
			);
			const commentFromPayload2 = { ...action.payload };

			if (commentFromPayload2.author === state.currentUser._id) {
				demote(state);
			}

			return {
				...state,
			};
		case SET_NOTIFICATIONS:
			if (state.notifications !== action.payload.notifications) {
				state.notifications = [...action.payload.notifications];
				state.notifications.forEach((notification) => {
					notification.readBy &&
					state.currentUser &&
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
		case REPORT:
			return {
				...state,
				reports: [...state.reports, action.payload],
			};
		case SET_REPORTS:
			if (state.reports !== action.payload.docs) {
				state.reports = [...action.payload.docs];
			}

			return {
				...state,
			};
		default:
			return state;
	}
};

export default reducer;
