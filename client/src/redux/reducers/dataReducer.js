import {
	SET_SEEKS,
	LOADING_DATA,
	UPVOTE_SEEK,
	DOWNVOTE_SEEK,
	DELETE_SEEK,
} from '../types';

const initialState = {
	seeks: [],
	seek: {},
	loading: false,
};

const reducer = (state = initialState, action) => {
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
		case DOWNVOTE_SEEK:
		case UPVOTE_SEEK:
			let index = state.seeks.findIndex(
				(seek) => seek.id === action.payload.id
			);
			state.seeks[index] = { ...action.payload };

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
		default:
			return state;
	}
};

export default reducer;
