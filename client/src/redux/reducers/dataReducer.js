import {
	SET_SEEKS,
	SET_SEEK,
	LOADING_DATA,
	UPVOTE_SEEK,
	DOWNVOTE_SEEK,
	DELETE_SEEK,
	CLEAR_SEEK,
	POST_SEEK,
	EDIT_SEEK,
	POST_COMMENT,
	DELETE_COMMENT,
	UPVOTE_COMMENT,
	DOWNVOTE_COMMENT,
	EDIT_COMMENT,
	UPLOAD_PHOTO,
	SET_MULTIPLE_ERRORS,
	CLEAR_MULTIPLE_ERRORS,
} from '../types';

const initialState = {
	seeks: [],
	seek: {},
	loading: false,
	errors: {
		title: null,
		body: null,
	},
};

const reducer = (state = initialState, action) => {
	const isSeekEmpty = JSON.stringify(state.seek) === '{}' || !state.seek;
	switch (action.type) {
		case LOADING_DATA:
			return {
				...state,
				loading: true,
			};
		case UPLOAD_PHOTO:
			let userIndex = state.seeks.findIndex(
				(seek) => seek.author._id === action.user
			);

			if (userIndex !== -1) state.seeks[userIndex].author.photo = action.photo;

			return {
				...state,
			};
		case SET_SEEKS:
			return action.payload !== state.seeks
				? {
						...state,
						seeks: action.payload,
						loading: false,
				  }
				: { ...state };
		case SET_SEEK:
			return {
				...state,
				seek: action.payload,
			};
		case CLEAR_SEEK:
			return {
				...state,
				seek: {},
			};
		case DOWNVOTE_SEEK:
		case UPVOTE_SEEK:
			let index = state.seeks.findIndex(
				(seek) => seek.id === action.payload.id
			);
			state.seeks[index] = { ...action.payload };
			if (!isSeekEmpty) state.seek = { ...action.payload };

			return {
				...state,
			};
		case DELETE_SEEK:
			const tempSeeks = [...state.seeks];
			const i = state.seeks.findIndex((seek) => seek.id === action.payload.id);
			tempSeeks.splice(i, 1);

			return {
				...state,
				seeks: [...tempSeeks],
			};
		case POST_SEEK:
			return {
				...state,
				seeks: [action.payload, ...state.seeks],
				errors: {
					title: null,
					body: null,
				},
			};
		case EDIT_SEEK:
			const targetSeek = state.seeks.findIndex(
				(seek) => seek._id === action.payload._id
			);
			state.seeks[targetSeek] = { ...action.payload };
			state.seek =
				JSON.stringify(state.seek) !== '{}' ? { ...action.payload } : {};

			return { ...state };
		case POST_COMMENT:
			const seekIndex = state.seeks.findIndex(
				(seek) => seek.id === action.payload.seek
			);
			state.seeks[seekIndex].commentCount++;
			state.seeks[seekIndex].comments = state.seeks[seekIndex].comments.concat(
				action.payload
			);
			state.seek.commentCount++;
			state.seek.comments = [action.payload, ...state.seek.comments];

			return {
				...state,
			};
		case DELETE_COMMENT:
			state.seek.comments = state.seek.comments.filter(
				(comment) => comment._id !== action.payload._id
			);
			const delIndex = state.seeks.findIndex(
				(seek) => seek.id === action.payload.seek
			);

			state.seeks[delIndex].comments = state.seek.comments;
			state.seeks[delIndex].commentCount--;

			return {
				...state,
				seek: { ...state.seek, commentCount: --state.seek.commentCount },
			};
		case UPVOTE_COMMENT:
		case DOWNVOTE_COMMENT:
			const commentIndex = state.seek.comments.findIndex(
				(comment) => comment._id === action.payload._id
			);
			const tempComments = state.seek.comments;
			const { upvotes, downvotes } = action.payload;

			tempComments[commentIndex] = {
				...tempComments[commentIndex],
				upvotes,
				downvotes,
			};

			return {
				...state,
				seek: { ...state.seek, comments: [...tempComments] },
			};
		case EDIT_COMMENT:
			const targetedSeek = state.seeks.findIndex(
				(seek) => seek._id === action.payload.seek
			);
			const commentInd = state.seek.comments.findIndex(
				(comment) => comment._id === action.payload._id
			);
			const tempoComments = state.seek.comments;
			const { body } = action.payload;

			tempoComments[commentInd] = {
				...tempoComments[commentInd],
				body,
			};

			state.seeks[targetedSeek].comments[commentInd] = { ...action.payload };

			return {
				...state,
				seek: { ...state.seek, comments: [...tempoComments] },
			};
		case SET_MULTIPLE_ERRORS:
			return {
				...state,
				errors: action.errors,
			};
		case CLEAR_MULTIPLE_ERRORS:
			return {
				...state,
				errors: {
					title: null,
					body: null,
				},
			};
		default:
			return state;
	}
};

export default reducer;
