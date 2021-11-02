import {
	LOADING_UI,
	SET_ERRORS,
	CLEAR_ERRORS,
	SET_SUCCESS,
	CLEAR_SUCCESS,
} from '../types';

const initialState = {
	loading: false,
	error: null,
	success: null,
};

const uiReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOADING_UI:
			return {
				...state,
				loading: !state.loading,
			};
		case SET_ERRORS:
			return {
				...state,
				error: action.error,
			};
		case CLEAR_ERRORS:
			return {
				...state,
				error: null,
			};
		case SET_SUCCESS:
			return {
				...state,
				success: action.message,
			};
		case CLEAR_SUCCESS:
			return {
				...state,
				success: null,
			};
		default:
			return state;
	}
};

export default uiReducer;
