import {
	SET_SEEKS,
	SET_SEEK,
	LOADING_DATA,
	UPVOTE_SEEK,
	DOWNVOTE_SEEK,
	DELETE_SEEK,
	CLEAR_SEEK,
	POST_SEEK,
	POST_COMMENT,
} from '../types';

const initialState = {
	seeks: [],
	seek: {},
	loading: false,
};

const reducer = (state = initialState, action) => {
	const isSeekEmpty = JSON.stringify(state.seek) === '{}' || !state.seek;
	switch (action.type) {
		case LOADING_DATA:
			return {
				...state,
				loading: true,
			};
		case SET_SEEKS:
			return {
				...state,
				seeks: action.payload,
				loading: false,
			};
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
			};
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
		default:
			return state;
	}
};

export default reducer;
